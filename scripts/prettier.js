'use strict'

var glob = require('globby')
var prettier = require('prettier')
var fs = require('fs')
var path = require('path')
var commander = require('commander')
var Util = require('util')
var childProcess = require('child_process')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e['default'] : e
}

var glob__default = /*#__PURE__*/ _interopDefaultLegacy(glob)
var prettier__default = /*#__PURE__*/ _interopDefaultLegacy(prettier)
var fs__default = /*#__PURE__*/ _interopDefaultLegacy(fs)
var path__default = /*#__PURE__*/ _interopDefaultLegacy(path)
var Util__default = /*#__PURE__*/ _interopDefaultLegacy(Util)
var childProcess__default = /*#__PURE__*/ _interopDefaultLegacy(childProcess)

const execFile = Util__default.promisify(childProcess__default.execFile)
async function execGitCmd(args) {
  const gitResults = await execFile('git', args, {
    // 128 MB instead of the default 1MB to prevent "maxbuffer exceeded" on large diffs e.g. when updating icons
    maxBuffer: 128 * 1024 * 1024,
  })
  const stdout = gitResults.stdout.trim()
  if (stdout === '') {
    return []
  }
  return stdout.split('\n')
}
async function listChangedFiles({ branch }) {
  const comparedBranch = process.env.CIRCLECI ? `origin/${branch}` : branch
  const mergeBase = await execGitCmd(['rev-parse', comparedBranch])
  const gitDiff = await execGitCmd(['diff', '--name-only', mergeBase])
  const gitLs = await execGitCmd(['ls-files', '--others', '--exclude-standard'])
  return new Set([...gitDiff, ...gitLs])
}

/**
 * 项目标识
 * - https://www.ascii-art-generator.org/
 */
const banner = `
              _           _                   ____
             | |         | |                 |___ \\
__      _____| |__    ___| |_ ___ _ __  ___    __) |
\\ \\ /\\ / / _ \\ '_ \\  / __| __/ _ \\ '_ \\/ __|  |__ <
 \\ V  V /  __/ |_) | \\__ \\ ||  __/ |_) \\__ \\  ___) |
  \\_/\\_/ \\___|_.__/  |___/\\__\\___| .__/|___/ |____/
                                 | |
                                 |_|

`

// FIXME: Incorrect assumption
const workspaceRoot = process.cwd()
function runPrettier(options) {
  const { changedFiles, shouldWrite } = options
  let didWarn = false
  let didError = false
  const warnedFiles = []
  const ignoredFiles = fs__default
    .readFileSync(path__default.join(workspaceRoot, '.eslintignore'), 'utf-8')
    .split(/\r*\n/)
    .filter((line) => {
      return (
        // ignore comments
        !line.startsWith('#') &&
        // skip empty lines
        line.length > 0
      )
    })
    .map((line) => {
      if (line.startsWith('/')) {
        // "/" marks the cwd of the ignore file.
        // Since we declare the dirname of the gitignore the cwd we can prepend "." as a shortcut.
        return `.${line}`
      }
      return line
    })
  const files = glob__default
    .sync('**/*.{js,md,tsx,ts,json}', {
      cwd: workspaceRoot,
      gitignore: true,
      ignore: [...ignoredFiles],
      dot: true,
    })
    .filter((f) => !changedFiles || changedFiles.has(f))
  if (!files.length) {
    return
  }
  const prettierConfigPath = path__default.join(workspaceRoot, '.prettierrc')
  files.forEach((file) => {
    const prettierOptions = prettier__default.resolveConfig.sync(file, {
      config: prettierConfigPath,
    })
    try {
      const input = fs__default.readFileSync(file, 'utf8')
      if (shouldWrite) {
        const output = prettier__default.format(input, { ...prettierOptions, filepath: file })
        if (output !== input) {
          console.log(`Formatting ${file}`)
          fs__default.writeFileSync(file, output, 'utf8')
        }
      } else {
        console.log(`Checking ${file}`)
        if (!prettier__default.check(input, { ...prettierOptions, filepath: file })) {
          warnedFiles.push(file)
          didWarn = true
        }
      }
    } catch (error) {
      didError = true
      console.log(`\n\n${error.message}`)
      console.log(file)
    }
  })
  if (didWarn) {
    console.log(
      '\n\nThis project uses prettier to format all JavaScript code.\n' +
        `Please run '${!changedFiles ? 'yarn prettier:all' : 'yarn prettier'}'` +
        ' and commit the changes to the files listed below:\n\n'
    )
    console.log(warnedFiles.join('\n'))
  }
  if (didWarn || didError) {
    throw new Error('Triggered at least one error or warning')
  }
}
async function run(argv) {
  const { mode, branch } = argv
  const shouldWrite = mode === 'write' || mode === 'write-changed'
  const onlyChanged = mode === 'check-changed' || mode === 'write-changed'
  let changedFiles
  if (onlyChanged) {
    changedFiles = await listChangedFiles({ branch })
  }
  runPrettier({ changedFiles, shouldWrite, branch })
}
commander.program
  .addHelpText('beforeAll', banner)
  .version('0.0.0', '-v, --version', '当前版本')
  .option('-b, --branch [name]', '分支名称')
  .option('-m, --mode <mode>', '"write" | "check-changed" | "write-changed"', 'write')
  .action(run)
  .parse()
