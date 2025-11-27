import express from 'express';
import { db } from '../db.js';
const router = express.Router();

// Consultar todos
router.get('/', (req, res) => {
  db.query('SELECT * FROM peliculas', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Consultar por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

// Agregar
router.post('/', (req, res) => {
  const { titulo, año, genero, director } = req.body;
  db.query('INSERT INTO peliculas (titulo, año, genero, director) VALUES (?, ?, ?, ?)', 
    [titulo, año, genero, director], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

// Editar
router.put('/:id', (req, res) => {
  const { titulo, año, genero, director } = req.body;
  db.query('UPDATE peliculas SET titulo=?, año=?, genero=?, director=? WHERE id=?', 
    [titulo, año, genero, director, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ status: 'Actualizado' });
  });
});

// Eliminar
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM peliculas WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ status: 'Eliminado' });
  });
});

export default router;
