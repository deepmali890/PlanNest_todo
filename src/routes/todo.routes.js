const express = require('express');
const todoController = require('../controller/todo.controller');
const protect = require('../middleware/auth.middleware');


const router = express.Router();


router.get('/getAllTodos', protect, todoController.getAllTodos);
router.get('/getTodos/:id', protect, todoController.getTodos);
router.post('/createTodo', protect, todoController.createTodo);
router.put('/updateTodo/:id', protect, todoController.updateTodo);
router.delete('/deleteTodo/:id', protect, todoController.deleteTodo);


module.exports = router;