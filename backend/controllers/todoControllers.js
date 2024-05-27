import Todo from "../model/TodoModel.js";

const getTodo = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

const addTodo = async (req, res) => {
  console.log(req.body);
  const todo = await Todo.create({
    title: req.body.title,
    desc: req.body.desc,
  });
  res.json(todo);
};

const deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted");
};

const updateTodo = async (req, res) => {
  const { title, desc } = req.body;
  const todo = await Todo.findById(req.params.id);
  todo.title = title || todo.title;
  todo.desc = desc || todo.desc;
  const updateTodo = await todo.save();
  res.json(updateTodo);
};

export { getTodo, addTodo, deleteTodo, updateTodo };
