import { useState, useEffect } from 'react'

type TipoReaccion = 'like' | 'dislike' | null

interface UseReaccionReturn {
  likes: number
  dislikes: number
  reaccionUsuario: TipoReaccion
  loading: boolean
  reaccionar: (tipo: 'like' | 'dislike') => Promise<void>
}

export function useReaccion(idPosteo: string, userId: string): UseReaccionReturn {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [reaccionUsuario, setReaccionUsuario] = useState<TipoReaccion>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchReacciones() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/reaccion/${idPosteo}?userId=${userId}`
        )
        const data = await res.json()
        setLikes(data.likes)
        setDislikes(data.dislikes)
        setReaccionUsuario(data.reaccionUsuario)
      } catch (err) {
        console.error('Error al cargar reacciones', err)
      }
    }
    fetchReacciones()
  }, [idPosteo, userId])

  async function reaccionar(tipo: 'like' | 'dislike') {
    if (loading) return
    setLoading(true)

    const anterior = reaccionUsuario
    const esToggleOff = reaccionUsuario === tipo

    setReaccionUsuario(esToggleOff ? null : tipo)
    setLikes((prev) => {
      if (tipo === 'like') return esToggleOff ? prev - 1 : prev + 1
      if (anterior === 'like') return prev - 1  //!Cambia de like a dislike
      return prev
    })
    setDislikes((prev) => {
      if (tipo === 'dislike') return esToggleOff ? prev - 1 : prev + 1
      if (anterior === 'dislike') return prev - 1  //!Cambia de dislike a like
      return prev
    })

    try {
      const res = await fetch(`http://localhost:3000/api/reaccion/${idPosteo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tipo }),
      })
      if (!res.ok) {
        setReaccionUsuario(anterior)
        const data = await fetch(
          `http://localhost:3000/api/reaccion/${idPosteo}?userId=${userId}`
        ).then((r) => r.json())
        setLikes(data.likes)
        setDislikes(data.dislikes)
      }
    } catch (err) {
      console.error('Error al reaccionar', err)
      setReaccionUsuario(anterior)
    } finally {
      setLoading(false)
    }
  }

  return { likes, dislikes, reaccionUsuario, loading, reaccionar }
}
