const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;

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
            assert.equal(res.body.issue_title, 'Chai-test issue');
            assert.equal(res.body.assigned_to, 'aaa');
            assert.equal(res.body.created_by, 'chai');
            assert.equal(res.body.status_text, 'Not Done');
            assert.equal(res.body.issue_text, 'Functional test');
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
      
      test('View issues on a project: GET request to /api/issues/{project}', (done) => {
        chai.request(server).get('/api/issues/apitest')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 3);
            done();
          });
      });
       
      test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
        chai.request(server).get('/api/issues/apitest')
          .query({ _id: '606b597f3220c61ca4b77e4b' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              _id: "606b597f3220c61ca4b77e4b",
              issue_title: "test-mod1",
              issue_text: "más szöveg",
              created_on: "2021-04-05T18:39:59.138Z",
              updated_on: "2021-04-05T19:33:44.749Z",
              created_by: "bibib",
              assigned_to: "",
              status_text: ""
            });
            done();
          });
      });
       
      test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
        chai.request(server).get('/api/issues/apitest')
          .query({
            issue_title: "test-mod1",
            issue_text: "más szöveg",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              _id: "606b597f3220c61ca4b77e4b",
              issue_title: "test-mod1",
              issue_text: "más szöveg",
              created_on: "2021-04-05T18:39:59.138Z",
              updated_on: "2021-04-05T19:33:44.749Z",
              created_by: "bibib",
              assigned_to: "",
              status_text: ""
            });
            done();
          });
      });
    });

    suite('PUT request tests', () => {
       
      test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        chai.request(server).put('/api/issues/test-put')
          .send({
            _id: '606b7570c823f941c0de2113',
            issue_title: 'updated title'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, '606b7570c823f941c0de2113');
            done();
          });
      });
       
      test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        chai.request(server).put('/api/issues/test-put')
          .send({
            _id: '606b7570c823f941c0de2113',
            issue_title: 'updated again',
            issue_text: 'updated this too'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, '606b7570c823f941c0de2113');
            done();
          });
      });
       
      test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
        chai.request(server).put('/api/issues/test-put')
          .send({
            issue_title: 'updated again',
            issue_text: 'updated this too'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      });
       
      test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
        chai.request(server).put('/api/issues/test-put')
          .send({
            _id: '606b7570c823f941c0de2113'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
          });
      });
       
      test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
        chai.request(server).put('/api/issues/test-put')
          .send({
            _id: '12341c0de2113',
            issue_title: 'updated again'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not update');
            done();
          });
      });
    });

    suite('DELETE request tests', () => {
       
      test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        // chai.request(server).delete('/api/issues/projects')
        //   .send({
        //     _id: deleteID
        //   })
        //   .end((err, res) => {
        //     assert.equal(res.status, 200);
        //     assert.equal(res.body.result, 'successfully deleted');
        //     done();
        //   });
      });
       
      test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}');
       
      test('Delete an issue with missing _id: DELETE request to /api/issues/{project}');
    });
  
  });
});
