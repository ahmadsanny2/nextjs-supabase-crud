"use client"

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

    const { error } = await supabase
      .from('students')
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

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return

    const { error } = await supabase
      .from('students')
      .update(
        {
          nama_siswa: form.nama_siswa,
          kelas: form.kelas,
          alamat: form.alamat
        }
      )
      .eq('id', editingId)

    if (error) {
      alert('Gagal update: ' + error.message);
      return;
    }
    setEditingId(null)
    setForm({ nama_siswa: '', kelas: '', alamat: '' } as any)
    await fetchStudents()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus siswa ini?')) return

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Gagal delete: ' + error.message);
      return;
    }
    await fetchStudents()
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>CRUD Sederhana: Siswa</h1>

      <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Nama Siswa"
          value={form.nama_siswa}
          onChange={(e) => setForm({ ...form, nama_siswa: e.target.value })}
        />
        <input
          placeholder="Kelas (mis. X RPL 1)"
          value={form.kelas}
          onChange={(e) => setForm({ ...form, kelas: e.target.value })}
        />
        <input
          placeholder="Alamat"
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{editingId ? 'Update' : 'Tambah'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ nama_siswa: '', kelas: '', alamat: '' } as any); }}>
              Batal
            </button>
          )}
        </div>
      </form>

      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Siswa</th>
            <th>Kelas</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s.id}>
              {/* index + 1 = nomor urut */}
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{s.nama_siswa}</td>
              <td>{s.kelas}</td>
              <td>{s.alamat}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button onClick={() => startEdit(s)}>Edit</button>{' '}
                <button onClick={() => handleDelete(s.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default Home