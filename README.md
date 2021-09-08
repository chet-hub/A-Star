![loading gif](https://raw.githubusercontent.com/chet-hub/chet-hub.github.io/main/A-Star/a-star-game.gif)

# What is A* algorithm  

- A path finding algorithm

- In games like StarCraft and DotA, users click on the map with a mouse and want the hero to go somewhere, 
  they can go in the shortest time to their destination.
  
- Don’t be scared, It's so simple that I implement the core algorithm with 10-lines javascript codes.

```javascript
findPath(start, goal) {
    start = start.toString()
    goal = goal.toString()

    const that = this;
    const frontier = that.newQueue()
    const steps = new Map();
    const costSoFar = new Map();


    frontier.put(start, 0);
    steps.set(start, null);
    costSoFar.set(start, 0);

    //////////////////
    //A star algorithm
    //////////////////
    while (frontier.notEmpty()) {
        const current = frontier.get();
        if (current === goal) {
            return that.buildPathBySteps(start, goal, steps);
        }
        that.neighbors(current).forEach(function (next) {
            const new_cost = costSoFar.get(current) + that.cost(current, next)
            if (!costSoFar.has(next) || new_cost < costSoFar.get(next)) {
                costSoFar.set(next, new_cost);
                frontier.put(next, new_cost + that.distance(next, goal))
                steps.set(next, current);
            }
        })
    }
    //Can't find the path to the goal
    return;
}

```

# A* 3D game demo
`check out the online demo - https://a-star-3d.netlify.app/`

#### How to play

1. Control the camera
   
     - click `A` move camera left
     - click `D` move camera right
     - click `W` move camera right
     - click `S` move camera back
     - `Hold down the left mouse button and move` - change the direction of the camera
      
2. Control the objects in the game

    - `click the balls or the cubic boxes, then click the ground`  - pick up the objects, and drop them on the point that you click on the ground





