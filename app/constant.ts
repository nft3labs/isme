type UploadFile = {
  Name: string
  Hash: string
  Size: string
}
export const DEFAULT_AVATARS: UploadFile[] = [
  { Name: 'NFT3-0915_1.jpg', Hash: 'QmQogwY3RhGYYLha4MWEF5GcRficmTeSKDv4w6FLiPWP22', Size: '96151' },
  { Name: 'NFT3-0915_2.jpg', Hash: 'QmaSCKiuFjNc8XLVJHWzgAebjjcthZgwK5SsQEjskBj1oq', Size: '85697' },
  { Name: 'NFT3-0915_3.jpg', Hash: 'QmZdvaknAamNGbkRmUDU4cNGr3zpBsbsy4zyNbPbt8SEnn', Size: '113590' },
  { Name: 'NFT3-0915_4.jpg', Hash: 'QmRsEFvyb88vJD4V1WPeUQ7GXRGm3LS34Q3hCSSwZiaJhG', Size: '79762' },
  { Name: 'NFT3-0915_5.jpg', Hash: 'QmUqYLqPkA4Ch59qBG64yWd2wVbNpRWmxVaXabLE4aaych', Size: '86610' },
  { Name: 'NFT3-0915_6.jpg', Hash: 'Qme16u3tbeHCt3NGJoSRKFMo4KR5E81AHVcxT2VJbsVvmD', Size: '92041' },
  { Name: 'NFT3-0915_7.jpg', Hash: 'QmYagbeLLKg4P5GRyZ2zvs2qwkZqBpc4S6iW2PM9ZhkoF2', Size: '86584' },
  { Name: 'NFT3-0915_8.jpg', Hash: 'QmWLMStxCEG7rF3Xbw4DhKgR5XNTw3PZw4S91Rn99kypAj', Size: '84012' },
  { Name: 'NFT3-0915_9.jpg', Hash: 'QmVRFtXrsUkWKWyeuovdzAsCTQsTRzpxuMrZWT9haieT9E', Size: '105206' },
]

export const getFilePath = (file: UploadFile) => {
  if (!file.Hash) return ''
  return `ipfs://${file.Hash}`
}
