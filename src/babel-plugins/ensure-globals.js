// in: a = ... (orphan identifier assignment)
// out: window.a = window.a !== 'undefined' ? window.a : ... (conditional global member expression assignment)
export default function ({ types: t }) {
  const isConditionalAssignment = (node) => {
    return (
      node.right.type == 'ConditionalExpression' &&
      node.right.test.type == 'BinaryExpression' &&
      node.right.test.left.type == 'UnaryExpression' &&
      node.right.test.right.type == 'StringLiteral' &&
      node.right.test.right.value == 'undefined'
    )
  }

  const isGlobalAssignment = (node) => {
    return (
      node.left.type == 'MemberExpression' &&
      node.left.object.name == 'window'
    )
  }

  const assignGlobally = (node) => {
    if (isGlobalAssignment(node)) return

    const globalAssignment = t.memberExpression(t.identifier('window'), t.identifier(node.left.name))

    node.left = globalAssignment
  }

  const assignIfUndefined = (node) => {
    if (isConditionalAssignment(node)) return

    const typeofNode = t.unaryExpression('typeof', node.left)
    const isNodeDefined = t.binaryExpression('!==', typeofNode, t.stringLiteral('undefined'))
    const assignment = t.conditionalExpression(isNodeDefined, node.left, node.right)

    node.right = assignment
  }

  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.scope.parent.type != 'Program') return

        const fnAssignment = t.assignmentExpression('=', path.node.id.name, path.node)
        assignGlobally(fnAssignment)
        assignIfUndefined(fnAssignment)

        path.insertAfter(fnAssignment)
        path.remove()
      },
      AssignmentExpression(path) {
        if (isGlobalAssignment(path.node)) {
          assignIfUndefined(path.node)

          return
        }

        if (path.node.left.type != 'Identifier') return
        if (path.scope.hasBinding(path.node.left.name)) return

        assignGlobally(path.node)
        assignIfUndefined(path.node)
      }
    }
  }
}
