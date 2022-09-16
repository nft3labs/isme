import type { GetStaticProps, GetStaticPropsContext } from 'next'

export type CreateGetStaticProps<T> = (getStaticProps: GetStaticProps, options?: T) => GetStaticProps
export type WithGetStaticPropsHandler<T> = (
  props: GetStaticPropsContext,
  options?: T
) => PromiseLike<GetStaticPropsContext> | GetStaticPropsContext

export const createWithGetStaticProps: <T = any>(
  withGetStaticPropsHandler: WithGetStaticPropsHandler<T>
) => CreateGetStaticProps<T> = (withGetStaticPropsHandler) => (getStaticPropsHandler, options) => async (props) => {
  props = Object.assign(props, await withGetStaticPropsHandler(props, options))
  return await getStaticPropsHandler(props)
}
