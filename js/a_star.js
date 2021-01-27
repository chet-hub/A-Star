class A_star_3d {
    constructor() {
        this.map_data = []
        this.w = 100;
        this.h = 100;
        for (let i = 0; i < this.w; i++) {
            let arr = [];
            this.map_data.push(arr);
            for (let j = 0; j < this.h; j++) {
                arr.push(0)
            }
        }
    }

    getDate(){
        return this.map_data;
    }

    setCode(code, x, y) {
        this.map_data[x][y] = code;
    }

    findCode(code) {
        const result = []
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if(this.map_data[i][j] === code){
                    result.push([i,j])
                }
            }
        }
        return result;
    }

    getCode(x, y) {
        return this.map_data[x][y];
    }

    toCoordinate(str) {
        return str.split(",").map(str => parseInt(str))
    }

    buildPathBySteps(start, goal, steps) {
        if (steps.length === 0) return;
        let result = [];
        let current = goal
        while (current !== start) {
            result.push(current);
            current = steps.get(current)
        }
        result.push(start);
        result = result.reverse();

        const lines = [];
        let from = result[0]
        let to;
        for (let i = 1; i < result.length; i++) {
            to = result[i]
            const f = this.toCoordinate(from)
            const t = this.toCoordinate(to)
            lines.push([f[0], f[1], t[0], t[1]])
            from = to;
        }
        return lines;
    }

    newQueue() {
        const that = this;

        class PriorityQueue {
            constructor() {
                this.data = []
            }

            notEmpty() {
                return this.data.length > 0
            }

            get() {
                this.data.sort((a, b) => (a.priority - b.priority));
                const result = this.data.shift().item
                return result;
            }

            put(item, priority) {
                this.data.push({item, priority})
            }
        }

        return new PriorityQueue();
    }

    neighbors(current) {
        current = this.toCoordinate(current)
        const result = []
        if (this.map_data[current[0] + 1][current[1]] !== 1) {
            result.push([current[0] + 1, current[1]].toString())
        }
        if (this.map_data[current[0] - 1][current[1]] !== 1) {
            result.push([current[0] - 1, current[1]].toString())
        }
        if (this.map_data[current[0]][current[1] + 1] !== 1) {
            result.push([current[0], current[1] + 1].toString())
        }
        if (this.map_data[current[0]][current[1] - 1] !== 1) {
            result.push([current[0], current[1] - 1].toString())
        }
        return result;
    }

    cost(current, next) {
        current = this.toCoordinate(current)
        next = this.toCoordinate(next)
        return Math.abs(current[0] - next[0]) + Math.abs(current[1] - next[1])
    }

    distance(from, to) {
        from = this.toCoordinate(from)
        to = this.toCoordinate(to)
        return Math.pow((from[0] - to[0])*(from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]),0.5);
    }

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

        console.log("Can't find the path to the goal");
        return;
    }
}












