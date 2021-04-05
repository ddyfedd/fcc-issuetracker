const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', () => {
    suite('POST request tests', () => {
      test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai.request(server).post('/api/issues/projects')
          .set('content-type', 'application/json')
          .send({
            issue_title: 'Chai-test issue',
            issue_text: 'Functional test',
            created_by: 'chai',
            assigned_to: 'aaa',
            status_text: 'Not Done'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            deleteID = res.body._id;
            assert.equal(res.body.issue_title, 'Chai-test issue 1');
            assert.equal(res.body.assigned_to, 'aaa');
            assert.equal(res.body.created_by, 'chai');
            assert.equal(res.body.status_text, 'Not Done');
            assert.equal(res.body.issue_text, 'Functional test 1');
            done();
          });
      });
      
      test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai.request(server).post('/api/issues/projects')
          .set('content-type', 'application/json')
          .send({
            issue_title: 'Chai-test issue',
            issue_text: 'Functional test',
            created_by: 'chai',
            assigned_to: '',
            status_text: '' 
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Chai-test issue');
            assert.equal(res.body.created_by, 'chai');
            assert.equal(res.body.issue_text, 'Functional test');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            done();
          });
      });
      
      test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai.request(server).post('/api/issues/projects')
          .set('content-type', 'application/json')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: 'chai',
            assigned_to: '',
            status_text: ''
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
      });
    });

    suite('GET request tests', () => {
      // View issues on a project: GET request to /api/issues/{project}
      test();
      // View issues on a project with one filter: GET request to /api/issues/{project}
      test();
      // View issues on a project with multiple filters: GET request to /api/issues/{project}
      test();
    });

    suite('PUT request tests', () => {
      // Update one field on an issue: PUT request to /api/issues/{project}
      test();
      // Update multiple fields on an issue: PUT request to /api/issues/{project}
      test();
      // Update an issue with missing _id: PUT request to /api/issues/{project}
      test();
      // Update an issue with no fields to update: PUT request to /api/issues/{project}
      test();
      // Update an issue with an invalid _id: PUT request to /api/issues/{project}
      test();
    });

    suite('DELETE request tests', () => {
      // Delete an issue: DELETE request to /api/issues/{project}
      test();
      // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
      test();
      // Delete an issue with missing _id: DELETE request to /api/issues/{project}
      test();
    });
  
  });
});
