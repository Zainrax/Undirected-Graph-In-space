import BST from './BinarySearchTree.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

tree = new BST()
tree.insert(1)
tree.insert(2)

tree.inOrder(val=>console.log(val))