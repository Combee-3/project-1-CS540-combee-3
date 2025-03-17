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

  //Shortest Time-To-Completion First (STCF) is too complex.
  //Requires a simulation loop??
  
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

//Multi-Level Feedback Queue (MLFQ) is also too complex.
//Involves multiple queues each with their own time slices.