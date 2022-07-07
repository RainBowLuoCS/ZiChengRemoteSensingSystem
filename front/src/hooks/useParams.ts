import { useSearchParams } from 'react-router-dom'

export function useParams(val: string) {
  const [searchParams] = useSearchParams()

  for (const [key, value] of searchParams) {
    if (key === val) return value
  }
}
