import React from 'react'
import { TextField, Typography } from '@mui/material'

export const DateField = ({ todo, index, onDateChange }) => {

  const daysLeft = (dueDate) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due - now 
    return Math.ceil(diff / (1000 * 60 * 60 * 24))  
  }

  const days = daysLeft(todo.dueDate)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', minWidth: '300px' }}>
      <TextField
        type="date"
        sx={{minWidth: '200px'}}
        value={todo.dueDate ? todo.dueDate.split('T')[0] : ''}
        onChange={(event) => {
          const dueDate = event.target.value || null
          onDateChange(index, dueDate)
        }}
      />
      {days !== null && (
        <Typography
          variant="caption"
          color={days >= 0 ? 'success' : 'error'}
        >
          {`${Math.abs(days)} days ${days >= 0 ? 'left' : 'overdue'}`}
        </Typography>
      )}
    </div>
  )
}
