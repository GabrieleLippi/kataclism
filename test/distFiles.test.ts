import { cat, exec, rm } from 'shelljs'

beforeAll(() => {
  exec(`tar tvf $(npm pack) > tar.txt`)
})

afterAll(() => {
  rm('-rf', 'kataclism-*.tgz')
  rm('tar.txt')
})

function removeFileInfoFrom(line: string): string {
  return line.replace(/^.*?p/g, 'p')
}

test('Check that the package which will be submitted to NPM contains all the files and the directories that it needs', () => {
  const rawFile = cat('tar.txt').stdout
  const splittedFile = rawFile.split('\n')
  const actualFiles = splittedFile
    .map((line: string) => removeFileInfoFrom(line))
    .join('\n')

  expect(actualFiles).toBe(`package/LICENSE
package/dist/lib/chooseKata.js
package/dist/constants.js
package/dist/lib/createTemplate.js
package/dist/lib/getKatasList.js
package/dist/index.js
package/templates/javascript/src/index.js
package/templates/javascript/test/index.test.js
package/dist/lib/katasReadme.js
package/package.json
package/templates/javascript/package.json
package/templates/typescript/package.json
package/templates/typescript/tsconfig.json
package/README.md
package/templates/javascript/README.md
package/templates/typescript/README.md
package/templates/typescript/test/index.test.ts
package/templates/typescript/src/index.ts
`)
})

test('Remove permission infos and timestamp from line', () => {
  const actualLine = removeFileInfoFrom(
    '-rw-rw-r-- 0/0            1072 1985-10-26 09:15 package/LICENSE'
  )

  expect(actualLine).toBe('package/LICENSE')
})
