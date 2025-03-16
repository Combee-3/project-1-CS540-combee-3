//This file contains the implementation of each CPU scheduling algorithm.

//FIFO (First In First Out)
export function fifo(processes) {
    let currentTime = 0;
    return processes.map(process => {
      let startTime = currentTime;
      let finishTime = startTime + process.burstTime;
      currentTime = finishTime;
      return { ...process, startTime, finishTime };
    });
  }
  
  //Shortest Job First (SJF)
  export function sjf(processes) {
    let sorted = [...processes].sort((a, b) => a.burstTime - b.burstTime);
    return fifo(sorted);
  }

  //Shortest Time-To-Completion First (STCF) is too complex.
  //Requires a simulation loop??
  
  //Round Robin (RR)
  export function roundRobin(processes, quantum) {
    let queue = [...processes];
    let time = 0, result = [];
  
    while (queue.length > 0) {
      let process = queue.shift();
      let executeTime = Math.min(process.burstTime, quantum);
      
      result.push({
        id: process.id,
        startTime: time,
        finishTime: time + executeTime
      });
  
      time += executeTime;
      process.burstTime -= executeTime;
      
      if (process.burstTime > 0) queue.push(process);
    }

    //Multi-Level Feedback Queue (MLFQ) is also too complex.
    //Involves multiple queues each with their own time slices.
  
    return result;
  }