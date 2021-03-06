const fs = require('fs-extra')
const chalk = require('chalk')

const variables = require('./variables')

const componentsRegistry = require(variables.libraryRegistryPath)

console.log(
  chalk.blue.inverse(`● Indexing ${variables.verboseName}`)
)
indexComponents()
console.log(
  chalk.green.inverse('\n✔ Done.')
)

// Functions

function indexComponents () {
  const fileContent = formContent()
  writeIndex(fileContent)
}

function formContent () {
  process.stdout.write(chalk.yellow(
    '├─ Forming content for index at',
    chalk.bold(variables.srcIndexPath),
    '... '
  ))

  const families = Object.keys(componentsRegistry)
  const imports = families.map(
    family => componentsRegistry[family].map(
      component => {
        let directory = component
        let name = component
        if (name instanceof Array) {
          directory = component[0]
          name = name.join('')
        }
        return `import ${name} from './${family}/${directory}/${name}'`
      }
    ).join('\n')
  ).join('\n\n')

  const components = families.map(
    family => componentsRegistry[family].map(
      component => {
        let name = component
        if (name instanceof Array) {
          name = name.join('')
        }
        return `  ${name}`
      }
    ).join(',\n')
  ).join(',\n\n')

  const registrations = families.map(
    family => componentsRegistry[family].map(
      component => {
        let name = component
        if (name instanceof Array) {
          name = name.join('')
        }
        return `    Vue.component('${name}', ${name})`
      }
    ).join('\n')
  ).join('\n\n')
  process.stdout.write(chalk.green('done\n'))

  const indexStencilContent = fs.readFileSync(
    variables.libraryStencilPath,
    {
      encoding: 'utf-8'
    }
  )
  return indexStencilContent
    .replace('{{imports}}', imports)
    .replace('{{components}}', components)
    .replace('{{registrations}}', registrations)
}

function writeIndex (fileContent) {
  process.stdout.write(chalk.yellow(
    '└─ Writing library exports to',
    chalk.bold(variables.srcIndexPath),
    '... '
  ))
  fs.writeFileSync(variables.srcIndexPath, fileContent)
  process.stdout.write(chalk.green('done\n'))
}
