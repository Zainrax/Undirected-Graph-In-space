class Node {
    constructor(key){
        this.key = key
        this.left = null
        this.right = null        
    }
}
class BST{
    // Constructs new BST.
    constructor(){
        this.root = null
    }

    // Insert key into root if root is empty, else call the insertNode function.
    insert(key){
        if(this.root == null){
            this.root = new Node(key)
        } else {
            this.insertNode(this.root,key)
        }
    }

    delete(key){
        this.root = this.deleteNode(this.root,key)                
    }
    
    deleteNode(node, key){
        if(node == null){
            return null
        }
        if(key < node.key){
            node.left = this.deleteNode(node.left, key)
            return node
        } else if ( key > node.key){
            node.right = this.deleteNode(node.right, key)
            return node
        } else{
            if(node.left == null && node.right == null){
                node = null
                return node
            }
            if(node.left == null){
                node = node.right
                return node
            } else if(node.right == null){
                node = node.left
                return node
            }
        }                                 
    }

    min(){
        return this.minNode(this.root)
    }
    
    minNode(node){
        let temp = node
        while(node!=null && temp.left != null){
            temp = temp.left
        }
        return temp
    }

    search(key){
        return this.searchNode(this.root, key);
    }

    searchNode(node, key){
        // Return null if key not found.
        if(node == null){
            return false;
        }
        // Recurse Left if key is smaller than node value.
        if(key < node.key){
            return this.searchNode(node.left, key);
        }
        // Recurse Right if key is smaller than node value.
        else if(key > node.key){
            return this.searchNode(node.right, key);
        }
        // If node found, return true.
        else{
            return true;
        }
    }
    
    insertNode(node, key){
        if(key < node.key){
            if(node.left == null){
                node.left = new Node(key);
            } else {
                this.insertNode(node.left, key);
            }
        } else {
            if(node.right == null){
                node.right = new Node(key)
            } else {
                this.insertNode(node.right, key)
            }            
        }
    }

    inOrder(func){
        this.inOrderNode(this.root,func)
    }            
    
    inOrderNode(node, func){
        if(node != null){
            this.inOrderNode(node.left,func)
            func(node.key)
            this.inOrderNode(node.right,func)
        }
    }
}
