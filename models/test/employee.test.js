const Employee = require('../employee.model.js');
const expect = require('chai').expect;

describe('Employee', () => {

  it('should throw an error if no "firstName and lastName" arg', async () => {
    const emp = new Employee({});
  
    emp.validateSync(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName and lastName" is not a string', () => {
    const cases = [{}, []];
    for(let name of cases) {
       const emp = new Employee({ firstName: name, lastName: name });
  
      emp.validateSync(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
      });
    }
  });
});