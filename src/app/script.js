import * as PIXI from 'pixi.js';
import 'style/style.css';
import 'style/modern-normalize.css';
import s1 from 'assets/Sprite-0001.png';
import s2 from 'assets/Sprite-0002.png';
import s3 from 'assets/Sprite-0003.png';
import s4 from 'assets/Sprite-0004.png';
import e1 from 'assets/Explosion-0001.png';
import e2 from 'assets/Explosion-0002.png';
import e3 from 'assets/Explosion-0003.png';
import e4 from 'assets/Explosion-0004.png';
import e5 from 'assets/Explosion-0005.png';

/** Handles page iterations and graph implementation.
 *
 * Author: Patrick Baxter, Sean Kim
 *  */
const parent = document.getElementById('canvas-holder');
const inputValue = document.getElementById('value-input');
const vert1Value = document.getElementById('vert1');
const vert2Value = document.getElementById('vert2');
const weightValue = document.getElementById('weight');
const startVert = document.getElementById('start-vert');
const endVert = document.getElementById('end-vert');

const insertButton = document.getElementById('insert');
const deleteButton = document.getElementById('delete');
const connectButton = document.getElementById('connect');
const searchButton = document.getElementById('search');

/**
 * Draws a line between two points.
 * @param {Object} line Line object
 * @param {number} x1 Vertex source x
 * @param {number} y1 Vertex source y
 * @param {number} x2 Vertex target x
 * @param {number} y2 Vertex target y
 * @param {number} colour colour of line
 */
function drawLine(line, x1, y1, x2, y2, colour) {
  line.clear();
  line.lineStyle(5, colour, 1);
  line.moveTo(x1, y1);
  line.lineTo(x2, y2);
}
/**
 * Draws text above a vertex for the distance from a source.
 * @param {container} vert vertex container
 * @param {number} w weight from a source
 */
function drawWeight(vert, w) {
  const weight = new PIXI.Text(w, {
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'monospace',
    fill: '#ffffff',
  });
  weight.y = -40;
  weight.x = 10;
  vert.addChild(weight);
}
/**
 * Sets dragging event to true once triggered.
 * @param {DragEvent} event object of event.
 */
function onDragStart(event) {
  this.data = event.data;
  this.dragging = true;
}

/**
 * End of click drag sets values back to default.
 * @param {DragEvent} event object of event.
 */
function onDragEnd() {
  this.dragging = false;
  this.data = null;
}

/**
 * Dragging drawing the new position and line.
 * @param {DragEvent} event object of event.
 */
function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
    const edges = Object.keys(this.edges);
    for (let i = 0; i < edges.length; i += 1) {
      drawLine(this.edges[edges[i]].line, this.x, this.y, this.edges[edges[i]].edge.x, this.edges[edges[i]].edge.y, this.edges[edges[i]].line.colour);
      this.edges[edges[i]].num.x = (this.x + this.edges[edges[i]].edge.x) / 2;
      this.edges[edges[i]].num.y = (this.y + this.edges[edges[i]].edge.y) / 2;
      this.edges[edges[i]].num.y += 10;
    }
  }
}
/** Class containing the graph implementation and Dijkstra's algorithm for shortest path. */
class Graph {
  /** Creates the PIXI canvas to draw, and initializes the vertices and graph. */
  constructor() {
    this.app = new PIXI.Application({ width: parent.offsetWidth, height: parent.offsetHeight });
    this.app.renderer.backgroundColor = 0x4b4b4b;
    this.app.renderer.autoResize = true;
    parent.appendChild(this.app.view);
    this.app.stage.sortableChildren = true;
    this.verticies = {};
    this.colour = {};
    this.graph = [];
  }

  /**
   * Initializes node creation at a random point on the screen.
   * @param {number} key key value
   */
  insert(key) {
    if (this.verticies[key] === undefined) {
      const x = Math.floor(Math.random() * this.app.screen.width);
      const y = Math.floor(Math.random() * this.app.screen.height);
      this.verticies[key] = this.createShip(key, x, y);
    }
  }

  /**
   * Deletes a vertex and it's lines connected.
   * @param {number} key
   */
  delete(key) {
    const vertex = this.verticies[key];
    const xy = vertex.getGlobalPosition();
    this.app.stage.removeChild(vertex);
    let totalLines = 0;
    Object.keys(this.verticies).forEach((tempKey) => {
      if (this.verticies[tempKey].edges.hasOwnProperty(key)) {
        const edge = this.verticies[tempKey].edges[key];
        this.graph.splice(edge.pos - totalLines, 1);
        this.app.stage.removeChild(this.verticies[tempKey].edges[key].line);
        this.app.stage.removeChild(this.verticies[tempKey].edges[key].num);
        delete this.verticies[tempKey].edges[key];
        totalLines += 1;
      }
    });
    delete this.verticies[key];
    this.renderExplosion(xy.x, xy.y);
  }

  /**
   * Creates a line between two vertices with a given weight.
   * @param {String} key1 First vertex
   * @param {String} key2 Second vertex
   * @param {weight} w weight of the line
   */
  connect(key1, key2, w) {
    const k1 = parseInt(key1, 10);
    const k2 = parseInt(key2, 10);
    const vert1 = this.verticies[k1];
    const vert2 = this.verticies[k2];
    const line = new PIXI.Graphics();
    const num = new PIXI.Text(w, {
      fontWeight: 'bold',
      fontSize: 15,
      fontFamily: 'monospace',
      fill: '#ffffff',
    });
    if (this.verticies[k1].edges[k2] === undefined) {
      this.verticies[k1].edges[k2] = {
        num, line, pos: this.graph.length, edge: this.verticies[k2],
      };
      this.verticies[k2].edges[k1] = {
        num, line, pos: this.graph.length, edge: this.verticies[k1],
      };
      line.lineStyle(5, 0xd63031, 1);
      line.colour = 0xd63031;
      num.x = (vert1.x + vert2.x) / 2;
      num.y = (vert1.y + vert2.y) / 2;
      num.y += 10;
      line.moveTo(vert1.x, vert1.y);
      line.lineTo(vert2.x, vert2.y);
      this.app.stage.addChildAt(line, 0);
      this.app.stage.addChildAt(num, 1);
      this.graph.push([key1, key2, w]);
    } else {
      this.verticies[k1].edges[k2].num.text = w;
      this.graph.splice(this.verticies[k1].edges[k2].pos, 1, [key1, key2, w]);
    }
  }

  /**
   * Creates an animated ship with an key at a given position.
   * @param {number} key Key for vertex
   * @param {number} x position
   * @param {number} y position
   */
  createShip(key, x, y) {
    const shipImages = [s1, s2, s3, s4];
    const textureArray = [];
    for (let i = 0; i < 4; i += 1) {
      const texture = PIXI.Texture.from(shipImages[i]);
      textureArray.push(texture);
    }
    const container = new PIXI.Container();
    const ship = new PIXI.extras.AnimatedSprite(textureArray);
    const number = new PIXI.Text(key, {
      fontWeight: 'bold',
      fontSize: 15,
      fontFamily: 'monospace',
      fill: '#00FF41',
    });
    ship.animationSpeed = 0.28;
    ship.anchor.set(0.5);
    number.anchor.set(0.5, 0.2);
    container.interactive = true;
    container.buttonMode = true;

    container.position.x = x;
    container.position.y = y;
    container
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);
    ship.play();
    container.edges = {};
    container.addChild(ship);
    container.addChild(number);
    this.app.stage.addChild(container);
    return container;
  }

  /**
   * Makes a cool explosion
   * @param {number} x positon
   * @param {number} y position
   */
  renderExplosion(x, y) {
    const exploImage = [e1, e2, e3, e4, e5];
    const textureArray = [];
    for (let i = 0; i < 5; i += 1) {
      const texture = PIXI.Texture.from(exploImage[i]);
      textureArray.push(texture);
    }
    const explosion = new PIXI.extras.AnimatedSprite(textureArray);
    explosion.x = x;
    explosion.y = y;
    explosion.loop = false;
    explosion.animationSpeed = 0.2;
    explosion.anchor.set(0.5);
    this.app.stage.addChild(explosion);
    explosion.play();
    explosion.onComplete = () => {
      this.app.stage.removeChild(explosion);
    };
  }

  /**
   * Dijkstra's algorithm implementation for shortest path.
   * @param {String} source vertex to start from.
   * @param {String} target vertex to find.
   */
  dijkstra(source, target) {
    const Q = new Set();
    const prev = {};
    const dist = {};
    const adj = {};
    const vertexMinDist = (Q, d) => {
      let minDist = Infinity;
      let u = null;
      for (const v of Q) {
        if (d[v] < minDist) {
          minDist = d[v];
          u = v;
        }
      }
      return u;
    };
    for (let i = 0; i < this.graph.length; i += 1) {
      const v1 = this.graph[i][0];
      const v2 = this.graph[i][1];
      const len = this.graph[i][2];
      Q.add(v1);
      Q.add(v2);
      dist[v1] = Infinity;
      dist[v2] = Infinity;
      if (adj[v1] === undefined) adj[v1] = {};
      if (adj[v2] === undefined) adj[v2] = {};
      adj[v1][v2] = len;
      adj[v2][v1] = len;
    }
    dist[source] = 0;
    while (Q.size) {
      const u = vertexMinDist(Q, dist);
      const neighbors = Object.keys(adj[u]).filter(v => Q.has(v));
      Q.delete(u);
      if (u === target) break;
      for (const v of neighbors) {
        const alt = dist[u] + adj[u][v];
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
        }
      }
    }


    let u = target;
    const S = [u];
    let edge;
    let len = 0;
    const keys = Object.keys(this.verticies);
    for (let i = 0; i < keys.length; i += 1) {
      if (dist[keys[i]] !== undefined) {
        drawWeight(this.verticies[keys[i]], dist[keys[i]]);
      } else {
        drawWeight(this.verticies[keys[i]], 'Infinity');
      }
    }

    while (prev[u] !== undefined) {
      const vert1 = this.verticies[parseInt(prev[u], 10)];
      const vert2 = this.verticies[parseInt(u, 10)];
      len += adj[u][prev[u]];
      S.unshift(prev[u]);

      edge = vert1.edges[parseInt(u, 10)];
      edge.line.colour = 0x00FF41;

      drawLine(edge.line, vert1.x, vert1.y, vert2.x, vert2.y, edge.line.colour);
      u = prev[u];
    }
    return [S, len];
  }

  /**
   * Clears the current weights, and initializes the algorithm.
   * @param {String} source vertex to start from.
   * @param {String} target vertex to find.
   */
  initDijkstra(source, target) {
    const vKey = Object.keys(this.verticies);
    let vert1;
    let vert2;
    for (let i = 0; i < vKey.length; i += 1) {
      const eKey = Object.keys(this.verticies[vKey[i]].edges);
      vert1 = this.verticies[vKey[i]];
      if (vert1.children.length > 2) {
        vert1.removeChildAt(2);
      }
      for (let j = 0; j < eKey.length; j += 1) {
        vert2 = this.verticies[eKey[j]];
        vert1.edges[eKey[j]].line.colour = 0xd63031;
        drawLine(vert1.edges[eKey[j]].line, vert1.x, vert1.y, vert2.x, vert2.y, vert1.edges[eKey[j]].line.colour);
      }
    }
    this.dijkstra(source, target);
  }

  /**
   * Resizes the window to the current window size.
   */
  resize() {
    this.app.renderer.resize(parent.offsetWidth, parent.offsetHeight);
  }
}
const g = new Graph();

window.onload = () => {
  g.resize();
  g.insert(10);
  g.insert(25);
  g.insert(20);
  g.insert(30);
  g.connect('10', '20', 2);
  g.connect('10', '30', 5);
};

window.onresize = () => {
  g.resize();
};

insertButton.onclick = () => {
  inputValue.style.borderColor = 'initial';
  if (inputValue.value === '') {
    inputValue.style.borderColor = 'red';
  }
  if (!isNaN(parseInt(inputValue.value, 10))) {
    g.insert(inputValue.value);
  }
};

deleteButton.onclick = () => {
  inputValue.style.borderColor = 'initial';
  if (inputValue.value === '') {
    inputValue.style.borderColor = 'red';
  }
  g.delete(inputValue.value);
};

connectButton.onclick = () => {
  vert1Value.style.borderColor = 'initial';
  vert2Value.style.borderColor = 'initial';
  weightValue.style.borderColor = 'initial';
  if (vert1Value.value === '') {
    vert1Value.style.borderColor = 'red';
  }
  if (vert2Value.value === '') {
    vert2Value.style.borderColor = 'red';
  }
  if (weightValue.value === '') {
    weightValue.style.borderColor = 'red';
  }

  if (!isNaN(parseInt(vert1Value.value, 10)) && !isNaN(parseInt(vert2Value.value, 10)) && !isNaN(parseInt(weightValue.value, 10))) {
    g.connect(vert1Value.value, vert2Value.value, parseInt(weightValue.value, 10));
  }
};

searchButton.onclick = () => {
  startVert.style.borderColor = 'initial';
  endVert.style.borderColor = 'initial';
  if (startVert.value === '') {
    startVert.style.borderColor = 'red';
  }
  if (endVert.value === '') {
    endVert.style.borderColor = 'red';
  }
  if (!isNaN(parseInt(startVert.value, 10)) || !isNaN(parseInt(endVert.value, 10))) {
    g.initDijkstra(startVert.value, endVert.value);
  }
};
