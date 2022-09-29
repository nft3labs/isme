import type { BoxProps } from '@mui/material'
import { Box, styled } from '@mui/material'
import clsx from 'clsx'
import React from 'react'

const StyledBox = styled(Box)<{ ellipsis?: boolean }>(({ ellipsis }) => ({
  ...(ellipsis && {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
}))

type Props = { ellipsis?: boolean }

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
      fontWeight={500}
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
      fontSize={13}
      component="small"
      fontWeight={500}
      lineHeight={1.6}
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
      fontSize={13}
      fontWeight={500}
      lineHeight={1.65}
      ellipsis={ellipsis}
      color="text.secondary"
      className={clsx({ [className || '']: true })}
      {...others}
    >
      {children}
    </StyledBox>
  )
}
