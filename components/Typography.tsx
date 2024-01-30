import type { BoxProps } from '@mui/material'
import { Box, styled } from '@mui/material'
import clsx from 'clsx'
import React, { type ReactNode } from 'react'

const StyledBox = styled(Box)<{ ellipsis?: boolean | string }>(({ ellipsis }) => ({
  ...(ellipsis && {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
}))

type Props = { ellipsis?: boolean | string }

export const H1: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={36}
      component="h1"
      fontWeight={600}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const H2: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={24}
      component="h2"
      fontWeight={600}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const H3: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={20}
      component="h3"
      fontWeight={400}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const H4: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={18}
      component="h4"
      fontWeight={600}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const H5: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={16}
      component="h5"
      lineHeight={1}
      fontWeight={600}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const H6: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={13}
      component="h6"
      fontWeight={600}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const Paragraph: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={16}
      component="p"
      fontWeight={400}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const Small: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={12}
      component="small"
      fontWeight={600}
      lineHeight="21px"
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const Span: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      fontSize={14}
      component="span"
      lineHeight="20.02px"
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const Tiny: React.FC<BoxProps & Props> = (props) => {
  const { ellipsis, children, className, ...others } = props

  return (
    <StyledBox
      component="p"
      fontSize={14}
      fontWeight={400}
      lineHeight="20.02px"
      ellipsis={ellipsis}
      color="text.secondary"
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}

export const NlToBr: React.FC<{
  text: string
}> = ({ text }) => (
  <>
    {text.split('\n').reduce((prev, curr, i) => {
      if (prev.length) {
        prev.push(<br key={i} />)
      }

      prev.push(curr)

      return prev
    }, [] as ReactNode[])}
  </>
)
