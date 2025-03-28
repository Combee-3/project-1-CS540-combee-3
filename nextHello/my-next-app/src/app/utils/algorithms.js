//This file contains the implementation of each CPU scheduling algorithm.

//FIFO (First In First Out)
export function fifo(processes)
{
  //if the input number of processes to run is not empty nor zero,
  if (!Array.isArray(processes) || processes.length === 0)
    {
      throw new Error("Processes should be a non-empty array");
    }

  let currentTime = 0;
  return processes.map(process => {
    //and if the input burst time is greater than zero,
    if (process.burstTime <= 0)
      {
        throw new Error("Burst time should be a positive value");
      }

    //calculate and return the FIFO algorithm for these processes.
    let startTime = currentTime;
    let finishTime = startTime + process.burstTime;
    currentTime = finishTime;
    return { ...process, startTime, finishTime };
  });
} //end of FIFO
  
//Shortest Job First (SJF)
export function sjf(processes) {
  //if the input number of processes to run is not empty nor zero,
  if (!Array.isArray(processes) || processes.length === 0)
    {
      throw new Error("Processes should be a non-empty array");
    }

  //calculate and return the SJF algorithm for these processes.
  let sorted = [...processes].sort((a, b) => a.burstTime - b.burstTime);
  return fifo(sorted);
} //end of SJF

//Shortest Time-To-Completion First (STCF)
export function stcf(processes) {
  //if the array of processes to run is not empty,
  if (!Array.isArray(processes) || processes.length === 0)
    {
      throw new Error("Processes should be a non-empty array");
    }
    
    //set variables for STCF algorithm
    let currentTime = 0;
    let completedProcesses = [];
    let remainingProcesses = [...processes];
    
    //run STCF for each process in the queue
    while (remainingProcesses.length > 0)
      {
        remainingProcesses.sort((a, b) => a.burstTime - b.burstTime);
        let process = remainingProcesses.shift();
        
        //if the process burst time is greater than zero
        if (process.burstTime <= 0)
          {
            throw new Error("Burst time should be a positive value");
          }
          
        //continue running the STCF algorithm
        let startTime = currentTime;
        let finishTime = startTime + process.burstTime;
        currentTime = finishTime;
        
        completedProcesses.push({ ...process, startTime, finishTime });
      } //end of while loop
  return completedProcesses; //return output for the pages file
} //end of STCF
  
//Round Robin (RR)
export function roundRobin(processes, quantum) {
  //if the input number of processes to run is not empty nor zero,
  if (!Array.isArray(processes) || processes.length === 0)
    {
      throw new Error("Processes should be a non-empty array");
    }
  //and if the time slices are greater than zero,
  if (quantum <= 0)
    {
      throw new Error("Quantum should be a positive value");
    }

  //calculate and return the RR algorithm for these processes.
  let queue = [...processes];
  let time = 0, result = [];

  while (queue.length > 0)
    {
      let process = queue.shift();
      if (process.burstTime <= 0)
        {
          throw new Error("Burst time should be a positive value");
        }
        
      let executeTime = Math.min(process.burstTime, quantum);
      
      result.push({
        id: process.id,
        startTime: time,
        finishTime: time + executeTime
      });
      
      time += executeTime;
      process.burstTime -= executeTime;
      
      if (process.burstTime > 0) queue.push(process);
    } //end of while loop

  return result;
} //end of RR

//Multi-Level Feedback Queue (MLFQ)
export function mlfq(processes, queues) {
  //if the input array of processes is not empty,
  if (!Array.isArray(processes) || processes.length === 0)
    {
      throw new Error("Processes should be a non-empty array");
    }
    
  //if the input array of queues is not empty,
  if (!Array.isArray(queues) || queues.length === 0)
    {
      throw new Error("Queues should be a non-empty array");
    }
    
  //initialize variables for the MLFQ algorithm
  let time = 0;
  let result = [];
  let queueIndex = 0;
  let queue = [...processes];

  //while there are still queues in the array,
  while (queue.length > 0)
    {
      //get the first process in the queue.
      let process = queue.shift();
      //if the burst time is greater than zero,
      if (process.burstTime <= 0)
        {
          throw new Error("Burst time should be a positive value");
        }

      //if the next process is not in the queue, add it to this queue.
      let quantum = queues[queueIndex];
      let executeTime = Math.min(process.burstTime, quantum);

      //calculate the start and finish time for the next process.
      result.push({
        id: process.id,
        startTime: time,
        finishTime: time + executeTime
      });
      
      //update the time slices and burst time for the next process.
      time += executeTime;
      process.burstTime -= executeTime;

      //if the burst time is greater than zero, add it to the next queue.
      if (process.burstTime > 0)
        {
          queueIndex = (queueIndex + 1) % queues.length;
          queue.push(process);
        }
    } //end of while loop
    
  return result; //return the start & finish times of the MLFQ algorithm.
} //end of MLFQ