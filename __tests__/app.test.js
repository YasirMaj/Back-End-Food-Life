const request = require("supertest");
const { authentication, db } = require("../firebaseconfig");
const app = require("../app");

describe("POST /api/users", () => {
  test("201 response with new user", () => {
    return request(app)
      .post("/api/users")
      .send({
        userId: "0012abc",
        firstName: "john",
        lastName: "doe",
        email: "johndoe@gmail.com",
        profile_pic: null,
        bio: null,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual({
          userId: "0012abc",
          firstName: "john",
          lastName: "doe",
          email: "johndoe@gmail.com",
          profile_pic: null,
          bio: null,
        });
      });
  });
});

describe("GET /api/users/:userId", () => {
  test("200 responds with specified user", () => {
    return request(app)
      .get("/api/users/0012abc")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.user).toEqual({
          userId: "0012abc",
          firstName: "john",
          lastName: "doe",
          email: "johndoe@gmail.com",
          profile_pic: null,
          bio: null,
        });
      });
  });
  //error handling
  test("404 - user not found", () => {
    return request(app)
      .get("/api/users/nonexistantuser")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404: User Not Found");
      });
  });
});

describe("POST /api/users/:userId/items", () => {
  test("201 response with new item", () => {
    return request(app)
      .post("/api/users/0012abc/items")
      .send({
        itemName: "Milk",
        expiryDate: "20/02/2023",
        amount: 2,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.item).toMatchObject({
          itemId: expect.any(String),
          itemName: "Milk",
          expiryDate: expect.any(String),
          amount: 2,
          created_at: expect.any(Object),
        });
      });
  });
  // error handling
  test("400 - Bad Request - Invalid Item Body", () => {
    return request(app)
      .post("/api/users/0012abc/items")
      .send({ itemName: "Milk" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("400 - Bad Request - Invalid Item Body");
      });
  });
  test("404 - user not found", () => {
    return request(app)
      .post("/api/users/nonexistantuser/items")
      .send({ itemName: "Milk", expiryDate: "20/02/2023", amount: 2 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - User Not Found");
      });
  });
});

describe("PATCH /api/users/:userId/items/:itemId", () => {
  test("200 should patch an item and return it", () => {
    return request(app)
      .patch("/api/users/0012abc/items/91FDWwSsVIsOr9AqQT5x")
      .send({ itemName: "Potato", expiryDate: "25/02/2090", amount: 4 })
      .expect(200)
      .then(({body}) => {
        expect(body.item).toMatchObject({
          itemId: "91FDWwSsVIsOr9AqQT5x",
          itemName: "Potato",
          expiryDate: "25/02/2090",
          amount: 4,
          created_at: expect.any(Object),
        });
      })
  });
  //error handling
  test("404 - user not found", () => {
    return request(app)
      .patch("/api/users/nonexistantuser/items/91FDWwSsVIsOr9AqQT5x")
      .send({ itemName: "Potato", expiryDate: "25/02/2090", amount: 4 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - User Not Found");
      });
  });
});

describe("GET /api/users/:userId/items", () => {
  test("200 - should return an array of items", () => {
    return request(app)
      .get("/api/users/0012abc/items")
      .expect(200)
      .then(({ body }) => {
        body.items.forEach((item) => {
          expect(item).toMatchObject({
            itemId: expect.any(String),
            itemName: expect.any(String),
            expiryDate: expect.any(String),
            amount: expect.any(Number),
            created_at: expect.any(Object),
          });
        });
      });
  });
  //error handling
  test("404 - user not found", () => {
    return request(app)
      .get("/api/users/nonexistantuser/items")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - User Not Found");
      });
  });
});

describe("GET: /api/users/:userId/items/:itemId", () => {
  test("200: should return an item of given id", () => {
    return request(app)
      .get("/api/users/0012abc/items/8CPAB9glO9hOFsgYa22J")
      .expect(200)
      .then(({ body }) => {
        expect(body.item).toEqual({
          itemId: "8CPAB9glO9hOFsgYa22J",
          itemName: "Milk",
          expiryDate: "20/02/2023",
          amount: 2,
          created_at: expect.any(Object),
        });
      });
  });
  //Error handling
  test("404: item with item_id does not exist", () => {
    return request(app)
      .get("/api/users/0012abc/items/Itemnotexist")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404: Item Not Found");
      });
  });
  test("404 - user not found", () => {
    return request(app)
      .get("/api/users/nonexistantuser/items/8CPAB9glO9hOFsgYa22J")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - User Not Found");
      });
  });
});
