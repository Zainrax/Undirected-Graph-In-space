class Node {
  constructor(key, x, y) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.x = x;
    this.y = y;
  }
}
export default class BST {
  // Constructs new BST.
  constructor() {
    this.root = null;
  }

  min() {
    return this.minNode(this.root);
  }

  minNode() {
    let temp = this.root;
    while (this.root != null && temp.left != null) {
      temp = temp.left;
    }
    return temp;
  }

  heightNode(node) {
    if (this.node == null) return -1;

    return Math.max(this.heightNode(node.left), this.heightNode(node.right)) + 1;
  }


  // Insert key into root if root is empty, else call the insertNode function.
  insert(key) {
    if (this.root == null) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key);
    }
  }

  insertNode(node, key) {
    if (key < node.key) {
      if (node.left == null) {
        node.left = new Node(key, node.x - 50, node.y + 100);
      }
      this.insertNode(node.left, key);
    } else if (node.right == null) {
      node.right = new Node(key, node.x + 50, node.y + 100);
    } else {
      this.insertNode(node.right, key);
    }
  }

  delete(key) {
    this.root = this.deleteNode(this.root, key);
  }

  deleteNode(node, key) {
    if (node == null) {
      return null;
    }
    if (key < node.key) {
      node.left = this.deleteNode(node.left, key);
      return node;
    } if (key > node.key) {
      node.right = this.deleteNode(node.right, key);
      return node;
    }
    if (node.left == null && node.right == null) {
      node = null;
      return node;
    }
    if (node.left == null) {
      node = node.right;
      return node;
    } if (node.right == null) {
      node = node.left;
      return node;
    }
  }


  search(key) {
    return this.searchNode(this.root, key);
  }

  searchNode(node, key) {
    // Return null if key not found.
    if (node == null) {
      return false;
    }
    // Recurse Left if key is smaller than node value.
    if (key < node.key) {
      return this.searchNode(node.left, key);
    }
    // Recurse Right if key is smaller than node value.
    if (key > node.key) {
      return this.searchNode(node.right, key);
    }
    // If node found, return true.

    return true;
  }


  inOrder(func) {
    this.inOrderNode(this.root, func);
  }

  inOrderNode(node, func) {
    if (node != null) {
      this.inOrderNode(node.left, func);
      func(node);
      this.inOrderNode(node.right, func);
    }
  }
}
