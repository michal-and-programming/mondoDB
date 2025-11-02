const Employee = require('../models/employee.model');

exports.getAll = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().skip(rand).populate('department', 'name');
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('department', 'name');
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.newEmployee = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    const populated = await newEmployee.populate('department', 'name');
    res.json({ message: 'OK', change: populated });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.updateEmployee = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const emp = await Employee.findById(req.params.id);
    if (emp) {
      await Employee.updateOne(
        { _id: req.params.id },
        { $set: { firstName, lastName, department } }
      );
      const updated = await Employee.findById(req.params.id).populate('department', 'name');
      res.json({ message: 'OK', updated });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('department', 'name');
    if (emp) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK', deleted: emp });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
