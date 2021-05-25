"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************** create */

describe("create a job", function () {
    let newJob = {
        companyHandle: "c1",
        title: "Test",
        salary: 70000,
        equity: "0.5",
    };

    test("should create a new job", async function() {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            ...newJob,
            id: expect.any(Number),
        });
    });
});


describe("findAll", function () {
    test("works to find all jobs with no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
        {
          id: testJobIds[0],
          title: "Job1",
          salary: 100,
          equity: "0.1",
          companyHandle: "c1",
          companyName: "C1",
        },
        {
          id: testJobIds[1],
          title: "Job2",
          salary: 200,
          equity: "0.2",
          companyHandle: "c1",
          companyName: "C1",
        },
        {
          id: testJobIds[2],
          title: "Job3",
          salary: 300,
          equity: "0",
          companyHandle: "c1",
          companyName: "C1",
        },
        {
          id: testJobIds[3],
          title: "Job4",
          salary: null,
          equity: null,
          companyHandle: "c1",
          companyName: "C1",
        },
      ]);
    });

    test("find job by min salary", async function () {
        let jobs = await Job.findAll({ minSalary: 250 });
        expect(jobs).toEqual([
          {
            id: testJobIds[2],
            title: "Job3",
            salary: 300,
            equity: "0",
            companyHandle: "c1",
            companyName: "C1",
          },
        ]);
      });
});


/***************** get */

describe("get", function () {
    test("get job by id", async function () {
      let job = await Job.get(testJobIds[0]);
      expect(job).toEqual({
        id: testJobIds[0],
        title: "Job1",
        salary: 100,
        equity: "0.1",
        company: {
          handle: "c1",
          name: "C1",
          description: "Desc1",
          numEmployees: 1,
          logoUrl: "http://c1.img",
        },
      });
    });
});


/********************* update */

describe("update", function () {
    let updateData = {
      title: "New",
      salary: 500,
      equity: "0.5",
    };

    test("updates a job", async function () {
      let job = await Job.update(testJobIds[0], updateData);
      expect(job).toEqual({
        id: testJobIds[0],
        companyHandle: "c1",
        ...updateData,
      });
    });
});


/********************* remove */

describe("remove", function () {
    test("removes a job", async function () {
      await Job.remove(testJobIds[0]);
      const res = await db.query(
          "SELECT id FROM jobs WHERE id=$1", [testJobIds[0]]);
      expect(res.rows.length).toEqual(0);
    });
});