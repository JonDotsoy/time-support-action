import * as semver from "semver";

export type TagData = { hash: string; ref: string; tag: string };

class IndexString {
  private m = new Set<symbol>();

  from(description: string) {
    for (const f of this.m) {
      if (f.description === description) return f;
    }

    const nextSymbol = Symbol(description);
    this.m.add(nextSymbol);
    return nextSymbol;
  }
}

const toMinorVersion = (description: string) => {
  const v = semver.parse(description);
  if (!v) return null;
  return `v${v.major}.${v.minor}`;
};

export const groupTags = (tags: TagData[]) => {
  const indexMinorVersion = new IndexString();
  const indexHash = new IndexString();

  const groupMinorTag = new Map<symbol, Set<TagData>>();
  const groupHash = new Map<symbol, Set<TagData>>();

  for (const tag of tags) {
    const minorVersion = toMinorVersion(tag.tag);

    if (minorVersion) {
      const minorVersionKey = indexMinorVersion.from(minorVersion);
      const minorTagCollection = groupMinorTag.get(minorVersionKey) ??
        new Set();
      groupMinorTag.set(minorVersionKey, minorTagCollection);
      minorTagCollection.add(tag);
    }

    const hashKey = indexHash.from(tag.hash);
    const hashCollection = groupHash.get(hashKey) ?? new Set();
    hashCollection.add(tag);
    groupHash.set(hashKey, hashCollection);
  }

  const o = Array.from(groupMinorTag.keys()).map((
    k,
  ): [symbol, Set<TagData>] => [k, new Set()]);

  const group = new Map<symbol, Set<TagData>>(o);

  for (const [minorVersionKey, tags] of group) {
    const minorVersionFound = groupMinorTag.get(minorVersionKey);
    if (minorVersionFound) {
      for (const sTag of minorVersionFound) {
        const tagByHash = groupHash.get(indexHash.from(sTag.hash));
        tags.add(sTag);
        if (tagByHash) {
          for (const hTag of tagByHash) {
            tags.add(hTag);
          }
        }
      }
    }
  }

  return new Set(
    Array.from(group.entries()).sort(([a], [b]) =>
      -semver.compare(
        semver.coerce(a.description)!,
        semver.coerce(b.description)!,
      )
    ).map((
      [, set],
    ) =>
      new Set(
        Array.from(set).sort(({ tag: a }, { tag: b }) => {
          const newLocal = semver.coerce(a)!;
          const newLocal_1 = semver.coerce(b)!;
          if (!newLocal) return 1;
          if (!newLocal_1) return -1;
          return semver.compare(
            newLocal,
            newLocal_1,
          );
        }),
      )
    ),
  );
};
