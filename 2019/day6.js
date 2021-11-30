const fs = require('fs');

class Node {

    label;
    parent;
    children;

    constructor(label) {
        this.label = label;
        this.patent = null;
        this.children = [];
    }

    addChild(childNode) {
        childNode.parent = this;
        this.children.push(childNode);
    }

    toString() {
        return this.label + ' (' + this.children.length + ' children)';
    }
}

const parseOrbitGraph = (orbits, resolveReturnValue) => {
    const map = {};

    const root = new Node('COM');
    map[root.label] = root;

    addChildTotalOrbits = 0;

    const getOrCreateNode = (label) => {
        if (map[label] == undefined) {
            map[label] = new Node(label);
        }
        return map[label];
    }

    orbits.forEach(orbitalRelationship => {
        const orbitParts = orbitalRelationship.split(')');
        const orbitee = getOrCreateNode(orbitParts[0].trim());
        const orbiter = getOrCreateNode(orbitParts[1].trim());
        orbitee.addChild(orbiter);
    });

    return resolveReturnValue(map, root);
};

const traverseGraph = (node, depth, visitCallback) => {
    visitCallback(node, depth);
    node.children.forEach(c => traverseGraph(c, depth + 1, visitCallback));
}

const bfs = (nodes, depth, predicate) => {
    // TODO mark nodes as visited to reduce repeated branch searches    
    if (nodes.some(predicate)) {
        return depth;
    }
    let nodes2 = nodes.reduce((all, c) => all.concat(c.children), []);
    if (nodes2.length > 0) {
        return bfs(nodes2, depth + 1, predicate);
    }
    return -1;
}

const countTotalOrbits = (node) => {
    let nodeCount = 0;
    let totalOrbits = 0;
    const incrementCounts = (n, d) => { totalOrbits += d; nodeCount++ };
    traverseGraph(node, 0, incrementCounts);
    //console.log('visited ' + nodeCount + ' nodes and counted ' + totalOrbits + ' total orbits');
    return totalOrbits;
}

const countOrbitTransfers = (graphMap, fromNodeLabel, toNodeLabel) => {
    const matchNode = (n) => n.label == toNodeLabel;

    let currentNode = graphMap[fromNodeLabel].parent;
    let orbitTransfers = 0;

    while (true) {
        let matchDepth = bfs(currentNode.children, 0, matchNode);

        if (matchDepth !== -1) {
            orbitTransfers += matchDepth;
            break;
        }

        orbitTransfers++;
        currentNode = currentNode.parent;

        if (currentNode == undefined) {
            break;
        }
    }

    return orbitTransfers;
}

test = () => {
    console.log('--- start tests ---');

    const input1 = [ 'COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L' ];
    console.log('test 1?', countTotalOrbits(parseOrbitGraph(input1, (m, r) => r)) === 42);

    const input2 = [ 'COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L', 'K)YOU', 'I)SAN' ];
    console.log('test 2?', countOrbitTransfers(parseOrbitGraph(input2, (m, r) => m), 'YOU', 'SAN') === 4);

    console.log('--- end tests ---');
};

dailyProblems = () => {
    const input = fs.readFileSync('day6-input').toString().trim().split('\n');
    console.log(1, countTotalOrbits(parseOrbitGraph(input, (m, r) => r)));
    console.log(2, countOrbitTransfers(parseOrbitGraph(input, (m, r) => m), 'YOU', 'SAN'));
};

test();
dailyProblems();