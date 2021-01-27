window.onload = function () {

    const DrawObject = {
        Empty: 0,
        Wall: 1,
        Start: 2,
        Goal: 3
    }


    const canvasGrid = function (w, h, id) {
        const dx = 20, dy = 20;
        const listenersClick = [];
        const listenersDbClick = [];
        const canvas = document.getElementById(id);
        const eventProcess = (event,listeners)=>{
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            console.log(x, y)
            listeners.forEach(v => {
                v(Math.floor(x / 20), Math.floor(y / 20))
            })
        }
        canvas.addEventListener('click', function (event) {
            eventProcess(event,listenersClick)
        })
        canvas.addEventListener('dblclick', function (event) {
            eventProcess(event,listenersDbClick)
        })
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        const drawGrid = ()=>{
            for (let x = 0; x <= w; x += dx) {
                for (let y = 0; y <= h; y += dy) {
                    ctx.strokeStyle = '#f6f7e0';
                    ctx.lineWidth = 1;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
            }
        }
        const that = {
            drawGrid:()=>{
                drawGrid();
            },
            addClickListener: (fn) => {
                listenersClick.push(fn)
            },
            addDbClickListener: (fn) => {
                listenersDbClick.push(fn)
            },
            clearRect: (x, y) => {
                ctx.clearRect(x * dx, y * dy, dx, dy);
            },
            drawRect: (x, y, color) => {
                ctx.clearRect(x * dx, y * dy, dx, dy);
                ctx.fillStyle = color;
                ctx.fillRect(x * dx, y * dy, dx, dy);
                return that;
            },
            drawSmallRect: (x, y, color) => {
                ctx.fillStyle = color;
                ctx.fillRect(x * dx, y * dy, dx / 2, dy / 2);
                return that;
            },
            drawCircle: (x, y, color) => {
                ctx.clearRect(x * dx, y * dy, dx, dy);
                ctx.beginPath();
                ctx.arc(x * dx + dx / 2, y * dy + dy / 2, dx / 2, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.stroke();
                return that;
            },
            drawSmallCircle: (x, y, color) => {
                ctx.clearRect(x * dx, y * dy, dx, dy);
                ctx.beginPath();
                ctx.arc(x * dx + dx / 2, y * dy + dy / 2, dx / 4, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.stroke();
                return that;
            },
            drawLine: (x, y, x1, y1) => {
                ctx.beginPath();
                ctx.moveTo(x * dx + dx / 2, y * dy + dy / 2);
                ctx.lineTo(x1 * dx + dx / 2, y1 * dy + dy / 2);
                ctx.strokeStyle = "blue";
                ctx.stroke();
                return that;
            },
            drawText: (x, y, text) => {
                ctx.font = "15px Comic Sans MS";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(text, (x + 1) * dx - dx / 2, (y + 1) * dy - dy / 4);
            },
            drawByCode: (code, x, y) => {
                switch (code) {
                    case DrawObject.Wall://draw wall
                        that.drawRect(x, y, "black");
                        break;
                    case DrawObject.Start:
                        that.drawCircle(x, y, 'green');
                        break;
                    case DrawObject.Goal:
                        that.drawCircle(x, y, 'red');
                        break;
                    default:

                }
                return that;
            }
        }
        return that;
    };

    const pen = canvasGrid(50 * 20, 50 * 20, "grid");


    class a_star {
        constructor() {
            const that = this;
            this.map_data = []
            for (let i = 0; i < 50; i++) {
                let arr = [];
                this.map_data.push(arr);
                for (let j = 0; j < 50; j++) {
                    arr.push(0)
                }
            }
            pen.addClickListener((x, y) => {
                this.setCode(DrawObject.Wall, x, y)
                that.findPath([25, 2], [25, 40]);
            })
            pen.addDbClickListener((x, y) => {
                this.setCode(DrawObject.Empty, x, y)
                that.findPath([25, 2], [25, 40]);
            })
        }

        setCode(code, x, y) {
            this.map_data[x][y] = code;
            pen.drawByCode(this.map_data[x][y], x, y)
        }

        resetCode(x, y) {
            pen.drawByCode(this.map_data[x][y], x, y)
        }

        getCode(x, y) {
            return this.map_data[x][y];
        }

        reset() {
            for (let i = 0; i < 50; i++) {
                for (let j = 0; j < 50; j++) {
                    pen.clearRect(i, j)
                    pen.drawByCode(this.map_data[i][j], i, j)
                    // pen.drawText(i, j,this.map_data[i][j])
                }
            }
            // pen.drawGrid();
        }

        toCoordinate(str) {
            return str.split(",").map(str => parseInt(str))
        }

        newQueue() {
            const that = this;

            class PriorityQueue {
                constructor() {
                    this.data = []
                }

                toCoordinate = (str) => {
                    return str.split(",").map(str => parseInt(str))
                }

                notEmpty() {
                    return this.data.length > 0
                }

                get() {
                    this.data.sort((a, b) => (a.priority - b.priority));
                    const result = this.data.shift().item
                    // let p = this.toCoordinate(result);
                    // that.resetCode(p[0], p[1]);
                    return result;
                }

                put(item, priority) {
                    this.data.push({item, priority})
                    // let p = this.toCoordinate(item);
                    // pen.drawSmallRect(p[0], p[1], "#e37e19")
                    // pen.drawText(p[0], p[1], priority)
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
            return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
        }

        buildPathBySteps(start, goal, steps) {
            if(steps.length === 0 ) return ;
            let result = [];
            let current = goal
            while (current !== start) {
                result.push(current);
                current = steps.get(current)
            }
            result.push(start);
            result = result.reverse();

            this.reset();

            let from = result[0]
            let to;
            for (let i = 1; i < result.length; i++) {
                to = result[i]
                const f = this.toCoordinate(from)
                const t = this.toCoordinate(to)
                pen.drawLine(f[0], f[1], t[0], t[1])
                from = to;
            }
            return result;
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


    const aStar = new a_star();
    window['aStar'] = aStar
    aStar.setCode(DrawObject.Start, 25, 2);
    aStar.setCode(DrawObject.Wall, 25, 3);
    aStar.setCode(DrawObject.Goal, 25, 40);
    const steps = aStar.findPath([25, 2], [25, 40]);
    console.log(steps);


}









