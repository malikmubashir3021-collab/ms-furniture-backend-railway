import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import { getDb } from '../db.js'
import { queryAll } from '../helpers.js'
import { generateToken, authMiddleware, AuthRequest } from '../midware/auth.js'

const router = Router()

router.post('/login', async (req, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }
  const db = await getDb()
  const stmt = db.prepare('SELECT id, username, password FROM users WHERE username = ?')
  stmt.bind([username])
  let user: { id: number; username: string; password: string } | null = null
  if (stmt.step()) {
    const [id, uname, pw] = stmt.get()
    user = { id: id as number, username: uname as string, password: pw as string }
  }
  stmt.free()
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const match = bcrypt.compareSync(password, user.password)
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = generateToken(user.id)
  res.json({ token, username: user.username })
})

router.post('/register', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  const db = await getDb()

  const exists = queryAll(db, 'SELECT id FROM users WHERE username = ?', [username])
  if (exists.length > 0 && exists[0].values.length > 0) {
    return res.status(409).json({ error: 'Username already exists' })
  }

  const hash = bcrypt.hashSync(password, 10)
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash])
  res.json({ success: true, message: 'Admin created' })
})

export default router
