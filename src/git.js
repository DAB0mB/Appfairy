import execa from 'execa'
import path from 'path'
import { fs } from './libs'

// Will add given files and will ignore those who aren't exist
export const add = async (files) => {
  const { stdout: root } = await execa('git', [
    'rev-parse', '--show-toplevel'
  ])

  files = files.map((file) => path.resolve(root, file))

  let unstaged = await Promise.all([
    execa('git', ['diff', '--name-only']),
    execa('git', ['ls-files', '--others', '--exclude-standard']),
  ]).then((results) => {
    return results.reduce((unstaged, { stdout }) => {
      return unstaged.concat(stdout.split('\n').filter(Boolean))
    }, [])
  })

  unstaged = unstaged.map((file) => path.resolve(root, file))
  files = files.filter((file) => unstaged.includes(file))

  await execa('git', ['add', ...files])

  return files
}

// Will commit changes, and if files not exist, will print status
export const commit = (files, message, stdio = 'inherit') => {
  if (files && files.length) try {
    return execa('git', ['commit', '-m', `appfairy: ${message}`], {
      stdio,
    })
  }
  catch (e) {
    // Probably no changes were made
  }

  return execa('git', ['status'], {
    stdio,
  })
}

export const removeAppfairyFiles = async () => {
  const { stdout: diffFiles } = await execa('git', [
    'diff', '--name-only'
  ])

  if (diffFiles) {
    throw Error([
      'Cannot transpile: Your index contains uncommitted changes.',
      'Please commit or stash them.',
    ].join('\n'))
  }

  let { stderr, stdout: hash } = await execa('git', [
    'log', '-1', '--format=%H', `--grep=appfairy: Migrate`
  ])

  // Probably git is not initialized
  if (stderr) throw Error(stderr)
  // No previous migrations found
  if (!hash) return []

  // List all files but deleted ones
  let { stdout: files } = await execa('git', [
    'diff', '--name-only', '--diff-filter=ACMRTUXB', `${hash}~1`, hash
  ])
  files = files.split('\n').filter(Boolean)

  const { stdout: root } = await execa('git', [
    'rev-parse', '--show-toplevel'
  ])

  await Promise.all(files.map(async (file) => {
    return fs.unlink(`${root}/${file}`)
  }))

  return files
}

export default {
  add,
  commit,
  removeAppfairyFiles,
}
