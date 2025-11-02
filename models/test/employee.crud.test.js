const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;

describe('Employee', () => {
  before(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/companyDBtest', {useNewUrlParser: true, useUnifiedTopology: true,});
  } catch(err) {
    console.error(err);
  }
  });
});

describe('Reading data', () => {
  before(async () => {
    const testDepOne = new Department({name: 'Department #1'});
    await testDepOne.save();

    const testEmpOne = new Employee({
      firstName: 'Julia',
      lastName: 'Puchała',
      department: testDepOne._id
    });
    await testEmpOne.save();

    const testDepTwo = new Department({name: 'Department #2'});
    await testDepTwo.save();

    const testEmpTwo = new Employee({
      firstName: 'Kacper',
      lastName: 'Puchała',
      department: testDepTwo._id
    });
    await testEmpTwo.save();
  });

  it('should return all the data with find method', async () => {
    const employee = await Employee.find();
    expect(employee.length).to.be.equal(2);
  });

  it('should return proper document by various params with findOne method', async () => {
    const employee = await Employee.findOne({firstName: 'Julia'});
    expect(employee.firstName).to.be.equal('Julia');
  });
});

describe('Creating data', () => {

  before(async () => {
    const testDepOne = new Department({name: 'Department #1'});
    await testDepOne.save();
    
    it('should insert new document with insertOne method', async () => {
      const employee = new Employee({firstName: 'Julia', lastName: 'Puchała', department: testDepOne._id});
      await employee.save();
      const findEmployee = await Employee.findOne({firstName: 'Julia'});
      expect(findEmployee).to.not.be.null;
    });
  });
});

describe('Updating data', () => {
  beforeEach(async () => {
    const testDepOne = new Department({name: 'Department #1'});
    await testDepOne.save();

    const testEmpOne = new Employee({
      firstName: 'Julia',
      lastName: 'Puchała',
      department: testDepOne._id
    });
    await testEmpOne.save();

    const testDepTwo = new Department({name: 'Department #2'});
    await testDepTwo.save();

    const testEmpTwo = new Employee({
      firstName: 'Kacper',
      lastName: 'Puchała',
      department: testDepTwo._id
    });
    await testEmpTwo.save();
  });

  it('should properly update one document with "updateOne" method', async () => {
    await Employee.updateOne({ firstName: 'Julia', lastName: 'Puchała', }, { $set: { firstName: 'Paulina' }});
    const updatedEmployee = await Employee.findOne({ firstName: 'Paulina' });
    expect(updatedEmployee).to.not.be.null;
  });

  it('should properly update one document with "save" method', async () => {
    const employee = await Employee.findOne({ firstName: 'Julia' });
    employee.firstName = 'Paulina';
    await employee.save();
  
    const updatedEmployee = await Employee.findOne({ firstName: 'Paulina' });
    expect(updatedEmployee).to.not.be.null;
  });

  it('should properly update multiple documents with "updateMany" method', async () => {
    await Employee.updateMany({}, { $set: { firstName: 'Paulina' }});
    const employee = await Employee.find({ firstName: 'Paulina' });
    expect(employee.length).to.be.equal(2);
  });

  afterEach(async () => {
    await Employee.deleteMany();
    await Department.deleteMany();
  });
});

describe('Removing data', () => {
  beforeEach(async () => {
    const testDepOne = new Department({name: 'Department #1'});
    await testDepOne.save();

    const testEmpOne = new Employee({
      firstName: 'Julia',
      lastName: 'Puchała',
      department: testDepOne._id
    });
    await testEmpOne.save();

    const testDepTwo = new Department({name: 'Department #2'});
    await testDepTwo.save();

    const testEmpTwo = new Employee({
      firstName: 'Kacper',
      lastName: 'Puchała',
      department: testDepTwo._id
    });
    await testEmpTwo.save();
  });

  it('should properly remove one document with "deleteOne" method', async () => {
    await Employee.deleteOne({firstName: 'Julia'});
    const employee = await Employee.findOne({firstName: 'Julia'});
    expect(employee).to.be.null;
  });

  it('should properly remove multiple documents with "deleteMany" method', async () => {
    await Employee.deleteMany({});
    const employees = await Employee.find();
    expect(employees.length).to.be.equal(0);
  });

  afterEach(async () => {
    await Employee.deleteMany();
    await Department.deleteMany();
  });
});
