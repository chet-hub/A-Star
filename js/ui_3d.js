const UI_3D = function () {
    const coordinateToPosition = function (value) {
        const temp = Math.floor(value);
        if (temp % 2 == 0) {
            return temp + 1
        } else {
            return temp;
        }
    }

    const to_3D = (v) => Math.round(2 * v - 99)
    const to_2D = (v) => Math.round((v + 99) / 2)

    let removedSphere = [];

    const addSphereListeners = [];

    function addSphere(x, y) {
        const item = removedSphere.pop();
        document.querySelector("a-scene").insertAdjacentHTML('beforeend', `<a-sphere classname='${item.name}' position="${x} 1 ${y}" radius="1" color="${item.color}"></a-sphere>`);
        addSphereListeners.forEach(f => f(to_2D(x), to_2D(y), item.name))
    }

    const removeSphereListeners = [];

    function removeSphere(el) {
        const positions = el.getAttribute('position')
        removeSphereListeners.forEach(f => f(to_2D(positions.x), to_2D(positions.z), el.getAttribute("classname")))
        removedSphere.push({name: el.getAttribute("classname"), color: el.getAttribute("color")})
        el.remove();

    }

    const addCaseListeners = [];

    function addCase(x, y) {
        document.querySelector("a-scene").insertAdjacentHTML("beforeend",
            `<a-box position="${coordinateToPosition(x)} 1 ${coordinateToPosition(y)}}" depth="2" height="2" width="2"  material="src: #crate"></a-box>`)
        addCaseListeners.forEach(f => f(to_2D(x), to_2D(y)))
    }

    const removeCaseListeners = [];

    function removeCase(el) {
        const positions = el.getAttribute('position')
        removeCaseListeners.forEach(f => f(to_2D(positions.x), to_2D(positions.z)));
        el.remove();
    }

    document.querySelector("a-scene").addEventListener('click', function (evt) {
        if (undefined === evt.detail.intersectedEl) return;
        if (evt.detail.intersectedEl.tagName === "A-BOX") {
            removeCase(evt.detail.intersectedEl)
        } else if (evt.detail.intersectedEl.classList.contains("environment") || evt.detail.intersectedEl.getAttribute('classname') === 'line') {
            const p = evt.detail.intersection.point;
            if (removedSphere.length === 0) {
                //place the case
                addCase(coordinateToPosition(p.x), coordinateToPosition(p.z))
            } else {//place the sphere
                addSphere(coordinateToPosition(p.x), coordinateToPosition(p.z));
            }
        } else if (evt.detail.intersectedEl.tagName === "A-SPHERE") {
            //remove the sphere
            removeSphere(evt.detail.intersectedEl)
        } else {
            console.log(evt.detail.intersectedEl)
        }
    });


    const result = {
        Object_3d: {
            Empty: 0,
            Wall: 1,
            Start: 2,
            Goal: 3
        },
        initMap: (mapArray) => {
            const scene = document.querySelector("a-scene");
            let result = ""
            for (let x = 0; x < mapArray.length; x++) {
                for (let y = 0; y < mapArray.length; y++) {
                    const code = mapArray[x][y];
                    let p_x = to_3D(x)
                    let p_y = to_3D(y)
                    if (code === undefined || code === 0) {//empty

                    } else if (code === 1) {//case
                        result += `<a-box position="${p_x} 1 ${p_y}}" depth="2" height="2" width="2"  material="src: #crate"></a-box>`;
                    } else if (code === 2) {//start
                        result += `<a-sphere classname='start' position="${p_x} 1 ${p_y}" radius="1" color="green"></a-sphere>`
                    } else if (code === 3) {//goal
                        result += `<a-sphere classname='goal' position="${p_x} 1 ${p_y}" radius="1" color="red"></a-sphere>`
                    }
                }
            }
            scene.insertAdjacentHTML("beforeend", result);
        },

        addLines: (steps) => {
            if(!steps || steps.length==0) return;
            const scene = document.querySelector("a-scene");
            let result = ""
            steps.forEach(function (step) {
                result += `<a-entity classname='line' line="start: ${to_3D(step[0])} 0.5 ${to_3D(step[1])}; end: ${to_3D(step[2])} 0.5 ${to_3D(step[3])}; color: yellow"></a-entity>`
            })
            scene.insertAdjacentHTML("beforeend", result);
        },

        removeLines: () => {
            document.querySelectorAll("a-entity").forEach(el => {
                if (el.getAttribute("classname") === 'line') {
                    console.log("removeLine:"+el)
                    el.remove()
                }
            })
        },
        // getPositionOfSphere:()=>{
        //     const result = new Map();
        //     document.querySelectorAll("a-sphere").forEach(el=>{
        //         const positions = el.getAttribute('position');
        //         const name = el.getAttribute('classname');
        //         result.set(
        //             name,[to_2D(positions.x),to_2D(positions.z)]
        //         )
        //     })
        //     return result;
        // },
        removeCaseListener: (f) => {
            removeCaseListeners.push(f)
        },
        addCaseListener: (f) => {
            addCaseListeners.push(f)
        },
        removeSphereListener: (f) => {
            removeSphereListeners.push(f)
        },
        addSphereListener: (f) => {
            addSphereListeners.push(f)
        }
    }

    return result;
}