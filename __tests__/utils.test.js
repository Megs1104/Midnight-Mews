const {
  convertTimestampToDate, formattedTopicsData, formattedUsersData, createReferenceObject
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formattedTopicsData", () => {
  test("returns a new array", () => {
    const input = [];
    expect(formattedTopicsData(input)).not.toBe(input)
    expect(Array.isArray(formattedTopicsData(input))).toBe(true);
  })
  test("the first item in the array is slug", () => {
    const input = require("../db/data/test-data/topics")
    const output = formattedTopicsData(input)
    expect(output[0][0]).toBe("mitch")
  })
  test("the second item in the array is description", () => {
    const input = require("../db/data/test-data/topics")
    const output = formattedTopicsData(input)
    expect(output[0][1]).toBe("The man, the Mitch, the legend")
  })
  test("the third item in the array is img_url", () => {
    const input = require("../db/data/test-data/topics")
    const output = formattedTopicsData(input)
    expect(output[0][2]).toBe("")
  })
  test("does not mutate the input", () => {
    const input = require("../db/data/test-data/topics")
    formattedTopicsData(input)
    const control = require("../db/data/test-data/topics")
    expect(input).toEqual(control)
  })
})

describe("formattedUsersData", () => {
  test("returns a new array", () => {
    const input = require("../db/data/test-data/users");
    expect(formattedUsersData(input)).not.toBe(input)
    expect(Array.isArray(formattedUsersData(input))).toBe(true);
  })
  test("the first item in the array is username", () => {
    const input = require("../db/data/test-data/users")
    const output = formattedUsersData(input)
    expect(output[0][0]).toBe("butter_bridge")
  })
  test("the second item in the array is description", () => {
    const input = require("../db/data/test-data/users")
    const output = formattedUsersData(input)
    expect(output[0][1]).toBe("jonny")
  })
  test("the third item in the array is img_url", () => {
    const input = require("../db/data/test-data/users")
    const output = formattedUsersData(input)
    expect(output[0][2]).toBe("https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg")
  })
  test("does not mutate the input", () => {
    const input = require("../db/data/test-data/users")
    formattedUsersData(input)
    const control = require("../db/data/test-data/users")
    expect(input).toEqual(control)
  })
})

describe("createReferenceObject", () => {
  test("when passed an empty array, should return an empty object", () => {
    const input = [];
    const output = createReferenceObject(input);
    expect(output).toEqual({})
  })
  test("when passed an array containing one set of information, should return a correctly populated object", () => {
    const input = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }];
    const output = createReferenceObject(input);
    expect(output).toEqual({"Living in the shadow of a great man": 1})
  })
  test("when passed an array containing multipe sets of information, should return correctly populated objects", () => {
    const input = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },  {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: 1602828180000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: 1604394720000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 4,
      title: "Student SUES Mitch!",
      topic: "mitch",
      author: "rogersop",
      body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
      created_at: 1588731240000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 5,
      title: "UNCOVERED: catspiracy to bring down democracy",
      topic: "cats",
      author: "rogersop",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      created_at: 1596464040000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 6,
      title: "A",
      topic: "mitch",
      author: "icellusedkars",
      body: "Delicious tin of cat food",
      created_at: 1602986400000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 7,
      title: "Z",
      topic: "mitch",
      author: "icellusedkars",
      body: "I was hungry.",
      created_at: 1578406080000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 8,
      title: "Does Mitch predate civilisation?",
      topic: "mitch",
      author: "icellusedkars",
      body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
      created_at: 1587089280000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 9,
      title: "They're not exactly dogs, are they?",
      topic: "mitch",
      author: "butter_bridge",
      body: "Well? Think about it.",
      created_at: 1591438200000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 10,
      title: "Seven inspirational thought leaders from Manchester UK",
      topic: "mitch",
      author: "rogersop",
      body: "Who are we kidding, there is only one, and it's Mitch!",
      created_at: 1589433300000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 11,
      title: "Am I a cat?",
      topic: "mitch",
      author: "icellusedkars",
      body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
      created_at: 1579126860000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 12,
      title: "Moustache",
      topic: "mitch",
      author: "butter_bridge",
      body: "Have you seen the size of that thing?",
      created_at: 1602419040000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      article_id: 13,
      title: "Another article about Mitch",
      topic: "mitch",
      author: "butter_bridge",
      body: "There will never be enough articles about Mitch!",
      created_at: 1602419040000,
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }];
    const output = createReferenceObject(input);
    expect(output).toEqual({
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4,
      "UNCOVERED: catspiracy to bring down democracy": 5,
      "A": 6, 
      "Z": 7,
      "Does Mitch predate civilisation?": 8, 
      "They're not exactly dogs, are they?": 9, 
      "Seven inspirational thought leaders from Manchester UK": 10,
      "Am I a cat?": 11,
      "Moustache": 12,
      "Another article about Mitch": 13}
    )
  })

})

