type UploadFile = {
  Name: string
  Hash: string
  Size: string
}
export const DEFAULT_AVATARS: UploadFile[] = [
  { Name: 'icon-1001_1.svg', Hash: 'QmS4gPeSaawqrKWhCumNXDvWe2ukVGJBhuk4CTgk5UbszY', Size: '1334' },
  { Name: 'icon-1001_2.svg', Hash: 'QmNYARzz7YwM4Z1s2AHDpVJ9jyf5bvT18oiHRBviTRetXL', Size: '1476' },
  { Name: 'icon-1001_3.svg', Hash: 'QmePifEAHCoasrsKjy3NxW7XkhZhiAm3nCViFqZvKHW8N8', Size: '1846' },
  { Name: 'icon-1001_4.svg', Hash: 'QmXCipJpEsqnuq9yrDLgHNWh7njafk46KRgVn4vRWXY4rQ', Size: '17537' },
  { Name: 'icon-1001_5.svg', Hash: 'QmQhy9zAkbaPVWgVT8x3qTL8nzDo6UbmC6a8JBZSUVgSSp', Size: '17699' },
  { Name: 'icon-1001_6.svg', Hash: 'QmPC4bQXpi2x1GAGVU2CJUxnm1X14Cje4hmLUEC2Zkhh8T', Size: '17670' },
  { Name: 'icon-1001_7.svg', Hash: 'QmYz5j89pgLzcJYzBfqj2x3fSfZbUkVdFCwKytUBzszrBs', Size: '1349' },
  { Name: 'icon-1001_8.svg', Hash: 'QmPSZth2oHxeYq2QcQXc5UF2tmCotrg3LAuQxC61HEvD45', Size: '1295' },
  { Name: 'icon-1001_9.svg', Hash: 'QmUJvhbt6sd38etmsU4NNNVFnFPA8SF58QP5DrCxH8xoqR', Size: '1535' },
]

export const getFilePath = (file: UploadFile) => {
  if (!file.Hash) return ''
  return `ipfs://${file.Hash}`
}
