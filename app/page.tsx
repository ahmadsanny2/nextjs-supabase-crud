import { useState } from "react"
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
  
  return (

  )
}

export default Home