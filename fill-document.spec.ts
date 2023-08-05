import { expect, test } from "vitest";
import { groupTags, TagData } from "./fill-document.utils";

test("expect group by minor version", () => {
  const tags: TagData[] = [
    { hash: "a", tag: "v1", ref: "refs/tags/v" },
    { hash: "a", tag: "v1.0", ref: "refs/tags/v" },
    { hash: "a", tag: "v1.0.0", ref: "refs/tags/v" },
  ];

  const res = groupTags(tags);

  expect(res).toMatchInlineSnapshot(`
    Set {
      Set {
        {
          "hash": "a",
          "ref": "refs/tags/v",
          "tag": "v1.0.0",
        },
        {
          "hash": "a",
          "ref": "refs/tags/v",
          "tag": "v1",
        },
        {
          "hash": "a",
          "ref": "refs/tags/v",
          "tag": "v1.0",
        },
      },
    }
  `);
});

test("expect sort version", () => {
  const tags: TagData[] = [
    { hash: "a", tag: "v1", ref: "refs/tags/v" },
    { hash: "b", tag: "v2", ref: "refs/tags/v" },
  ];

  const res = groupTags(tags);

  expect(res).toMatchInlineSnapshot('Set {}');
});

test("expect last path version", () => {
  const tags: TagData[] = [
    { hash: "a", tag: "v1", ref: "refs/tags/v" },
    { hash: "a", tag: "v1.0", ref: "refs/tags/v" },
    { hash: "c", tag: "v1.0.1", ref: "refs/tags/v" },
    { hash: "b", tag: "v1.0.2", ref: "refs/tags/v" },
    { hash: "a", tag: "v1.0.3", ref: "refs/tags/v" },
  ];

  const res = groupTags(tags);

  expect(res).toMatchInlineSnapshot(`
    Set {
      Set {
        {
          "hash": "a",
          "ref": "refs/tags/v",
          "tag": "v1",
        },
        {
          "hash": "a",
          "ref": "refs/tags/v",
          "tag": "v1.0",
        },
        {
          "hash": "c",
          "ref": "refs/tags/v",
          "tag": "v1.0.1",
        },
        {
          "hash": "b",
          "ref": "refs/tags/v",
          "tag": "v1.0.2",
        },
        {
          "hash": "a",
          "ref": "refs/tags/v",
          "tag": "v1.0.3",
        },
      },
    }
  `);
});

test("expect last path version", () => {
  const tags: TagData[] = [
    { hash: "33", tag: "latest", ref: "refs/tags/v" },
    { hash: "05", tag: "v1.0", ref: "refs/tags/v" },
    { hash: "24", tag: "v1", ref: "refs/tags/v" },
    { hash: "24", tag: "v1.2", ref: "refs/tags/v" },
    { hash: "33", tag: "v1", ref: "refs/tags/v" },
    { hash: "33", tag: "v1.3", ref: "refs/tags/v" },
    { hash: "01", tag: "v1.0.1", ref: "refs/tags/v" },
    { hash: "02", tag: "v1.0.2", ref: "refs/tags/v" },
    { hash: "03", tag: "v1.0.3", ref: "refs/tags/v" },
    { hash: "05", tag: "v1.0.5", ref: "refs/tags/v" },
    { hash: "22", tag: "v1.2.2", ref: "refs/tags/v" },
    { hash: "04", tag: "v1.0.4", ref: "refs/tags/v" },
    { hash: "23", tag: "v1.2.3", ref: "refs/tags/v" },
    { hash: "24", tag: "v1.2.4", ref: "refs/tags/v" },
    { hash: "33", tag: "v1.3.3", ref: "refs/tags/v" },
  ];

  const res = groupTags(tags);

  expect(res).toMatchInlineSnapshot(`
    Set {
      Set {
        {
          "hash": "33",
          "ref": "refs/tags/v",
          "tag": "v1",
        },
        {
          "hash": "33",
          "ref": "refs/tags/v",
          "tag": "v1.3",
        },
        {
          "hash": "33",
          "ref": "refs/tags/v",
          "tag": "v1.3.3",
        },
        {
          "hash": "33",
          "ref": "refs/tags/v",
          "tag": "latest",
        },
      },
      Set {
        {
          "hash": "24",
          "ref": "refs/tags/v",
          "tag": "v1",
        },
        {
          "hash": "24",
          "ref": "refs/tags/v",
          "tag": "v1.2",
        },
        {
          "hash": "22",
          "ref": "refs/tags/v",
          "tag": "v1.2.2",
        },
        {
          "hash": "23",
          "ref": "refs/tags/v",
          "tag": "v1.2.3",
        },
        {
          "hash": "24",
          "ref": "refs/tags/v",
          "tag": "v1.2.4",
        },
      },
      Set {
        {
          "hash": "05",
          "ref": "refs/tags/v",
          "tag": "v1.0",
        },
        {
          "hash": "01",
          "ref": "refs/tags/v",
          "tag": "v1.0.1",
        },
        {
          "hash": "02",
          "ref": "refs/tags/v",
          "tag": "v1.0.2",
        },
        {
          "hash": "03",
          "ref": "refs/tags/v",
          "tag": "v1.0.3",
        },
        {
          "hash": "04",
          "ref": "refs/tags/v",
          "tag": "v1.0.4",
        },
        {
          "hash": "05",
          "ref": "refs/tags/v",
          "tag": "v1.0.5",
        },
      },
    }
  `);

  // expect(!res["v1.0"].find((d) => d.tag === "v1.0.3")).ok('boolean');
});
