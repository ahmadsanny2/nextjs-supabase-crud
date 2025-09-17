import { useEffect, useState } from "react"
import { supabase } from '../lib/supabaseClient';

type Student = {
  id: string
  nama_siswa: string
  kelas: string
  alamat: string
  created_at?: string
}

const Home = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [form, setForm] = useState<Omit<Student, 'id'>>({
    nama_siswa: '',
    kelas: '',
    alamat: ''
  } as any)

  const [editingId, setEditingId] = useState<string | null>(null)

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      return
    }
    setStudents(data as Student[])
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const { nama_siswa, kelas, alamat } = form
    if (!nama_siswa || !kelas || !alamat) return alert('Lengkapi Form')

    const { error } = await supabase.from('students')
      .insert([
        { nama_siswa, kelas, alamat }
      ])
    if (error) {
      alert('Gagal insert:'.error.message)
      return
    }
    setForm({ nama_siswa: '', kelas: '', alamat: '' } as any)
    await fetchStudents()
  }

  function startEdit(s: Student) {
    setEditingId(s.id)
    setForm({ nama_siswa: s.nama_siswa, kelas: s.kelas, alamat: s.alamat } as any)
  }

  return (

  )
}

export default Home