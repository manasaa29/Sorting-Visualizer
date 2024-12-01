const container = document.getElementById("array-container");

// Generate a random array based on the size specified by the user
function generateArray() {
    container.innerHTML = ""; // Clear existing bars
    const size = document.getElementById("size").value;
    const array = [];
    
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 10); // Random heights
    }

    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        bar.style.width = "10px";
        container.appendChild(bar);
    });
}

// Utility function for delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start sorting based on the selected algorithm
async function startSorting() {
    const algorithm = document.getElementById("algorithm").value;
    const speed = document.getElementById("speed").value;
    const bars = document.querySelectorAll(".bar");

    // Adjust the sorting speed (delay between steps)
    const delay = Math.max(10, 1000 - speed);

    switch (algorithm) {
        case "bubbleSort":
            await bubbleSort(bars, delay);
            break;
        case "selectionSort":
            await selectionSort(bars, delay);
            break;
        case "insertionSort":
            await insertionSort(bars, delay);
            break;
        case "mergeSort":
            await mergeSort(bars, delay);
            break;
        case "quickSort":
            await quickSort(bars, delay);
            break;
        default:
            alert("Invalid algorithm selected!");
    }
}

// Bubble Sort
async function bubbleSort(bars, delay) {
    for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            bars[j].style.background = "red"; // Compare
            bars[j + 1].style.background = "red";

            if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
                await sleep(delay);
                let temp = bars[j].style.height;
                bars[j].style.height = bars[j + 1].style.height;
                bars[j + 1].style.height = temp;
            }
            bars[j].style.background = "#6c5ce7";
            bars[j + 1].style.background = "#6c5ce7";
        }
    }
}

// Selection Sort
async function selectionSort(bars, delay) {
    for (let i = 0; i < bars.length; i++) {
        let minIdx = i;
        bars[i].style.background = "blue";
        for (let j = i + 1; j < bars.length; j++) {
            bars[j].style.background = "red";
            await sleep(delay);

            if (parseInt(bars[j].style.height) < parseInt(bars[minIdx].style.height)) {
                if (minIdx !== i) bars[minIdx].style.background = "#6c5ce7";
                minIdx = j;
            } else {
                bars[j].style.background = "#6c5ce7";
            }
        }
        await sleep(delay);
        let temp = bars[i].style.height;
        bars[i].style.height = bars[minIdx].style.height;
        bars[minIdx].style.height = temp;
        bars[minIdx].style.background = "#6c5ce7";
        bars[i].style.background = "#6c5ce7";
    }
}

// Insertion Sort
async function insertionSort(bars, delay) {
    for (let i = 1; i < bars.length; i++) {
        let key = bars[i].style.height;
        let j = i - 1;
        bars[i].style.background = "red";

        while (j >= 0 && parseInt(bars[j].style.height) > parseInt(key)) {
            bars[j].style.background = "#6c5ce7";
            await sleep(delay);
            bars[j + 1].style.height = bars[j].style.height;
            j--;
        }
        bars[j + 1].style.height = key;
        bars[i].style.background = "#6c5ce7";
    }
}

// Merge Sort
async function mergeSort(bars, delay) {
    let array = Array.from(bars).map(bar => parseInt(bar.style.height)); // Get the initial array from the DOM

    // Merge function
    async function merge(arr, l, m, r, delay) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = arr.slice(l, m + 1);
        let R = arr.slice(m + 1, r + 1);

        let i = 0, j = 0, k = l;

        while (i < n1 && j < n2) {
            bars[k].style.background = "red"; // Mark current bars as being compared
            await sleep(delay); // Pause for visual effect

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                bars[k].style.height = `${L[i]}px`; // Update the DOM with the new value
                i++;
            } else {
                arr[k] = R[j];
                bars[k].style.height = `${R[j]}px`; // Update the DOM with the new value
                j++;
            }
            bars[k].style.background = "#6c5ce7"; // Reset the color
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            bars[k].style.height = `${L[i]}px`;
            bars[k].style.background = "#6c5ce7";
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            bars[k].style.height = `${R[j]}px`;
            bars[k].style.background = "#6c5ce7";
            j++;
            k++;
        }
    }

    // Recursive function
    async function mergeSortRecursive(arr, l, r, delay) {
        if (l < r) {
            let m = Math.floor((l + r) / 2); // Find the middle index
            await mergeSortRecursive(arr, l, m, delay); // Recursively sort the left half
            await mergeSortRecursive(arr, m + 1, r, delay); // Recursively sort the right half
            await merge(arr, l, m, r, delay); // Merge the two sorted halves
        }
    }

    // Call the recursive merge sort function
    await mergeSortRecursive(array, 0, array.length - 1, delay);
}

      
   
//Quicksort
async function quickSort(bars, delay) {
    let array = Array.from(bars).map((bar) => parseInt(bar.style.height));

    async function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            bars[j].style.background = "red";
            await sleep(delay);

            if (arr[j] < pivot) {
                i++;
                // Swap bars[i] and bars[j]
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                bars[i].style.height = `${arr[i]}px`;
                bars[j].style.height = `${arr[j]}px`;
            }
            bars[j].style.background = "#6c5ce7";
        }

        // Swap pivot element with bars[i + 1]
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        bars[i + 1].style.height = `${arr[i + 1]}px`;
        bars[high].style.height = `${arr[high]}px`;
        return i + 1;
    }

    async function quickSortRecursive(arr, low, high) {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSortRecursive(arr, low, pi - 1);
            await quickSortRecursive(arr, pi + 1, high);
        }
    }

    await quickSortRecursive(array, 0, array.length - 1);
}
