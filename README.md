# project-1-CS540-combee-3
CS540 (Operating Systems), Bowen Madden, Project 1
Demonstrating CPU Scheduling Algorithms in a Web App

Hello World! This is practically my first time using Git & GitHub.

CPUs can only handle one process, or running instance of a program, at a time. CPU scheduling is a process employed by operating systems to control which process is allowed to use the CPU and which must wait, effectively treating the CPU as a resource which must be shared. In order to make the most of this resource, various algorithms are followed to autonomously plan the CPU schedule, fittingly known as CPU scheduling algorithms.

In this project, I will demonstrate some of these CPU scheduling algorithms by creating a web app which can simulate their effects, implementing each as a separate function and allowing users to modify values and compare the different algorithms' results. This will allow users to learn more about each algorithm and the circumstances they excel or fall short in, without having to actually adjust the CPU scheduling of their machine.

CPU scheduling algorithms can also be thought of as queues, where processes wait for their turn with the CPU. The algorithms included in this project are:

FIFO (First In, First Out)
The first process to enter the queue is the first to finish. Larger processes could "back-up" the queue, such that small processes cannot run as efficiently as they should be able to.

SJF (Shortest Job First)
Each process is given an estimate of how long it will take to finish, and the CPU tries to schedule the shortest to be completed first. This often "starves" larger processes, if shorter ones continue to enter the queue before the larger ones can have their turn.

STCF (Shortest Time-to-Completion First)
This is similar to SJF, however if a new process enters the queue, the Operating System compares its time with the currently-running process. If the new process could be finished in less time, the current one is put back in the queue until the shortest one finishes first. This also runs the risk of starving larger processes, but it is faster at completing smaller ones.

RR (Round Robin)
Each process in the queue is allowed to run for a set quota and time to complete, both measured in "time slices" (exact units vary per hardware). On its turn with the CPU, a process is allowed to run for the set quota, reducing its time by that many time slices. If it has not yet finished, it must move to the back of the queue, allowing the next process to have its turn. This is repeated until every process has been finished.

RR is the most fair form of CPU scheduling, favoring neither small nor large processes. However, it does still have its problems, namely that processes with even 1 time slice left will not be finished as soon as they could be, and will be moved all the way to the back of the queue before getting another turn. This may not be ideal for certain programs, especially if some are more important or urgent than others, such as those handling user inputs which need to be fast & responsive.

MLFQ (Multi-Level Feedback Queue)
Describes any situation where one algorithm determines how to divide CPU time into queues, and other algorithms decide how to run each queue. For instance, different queues could have different priorities, and processes in the higher-priority queues will always run before those in lower-priority queues. Meanwhile, one queue may use Round-Robin scheduling for its individual prcoesses, but another queue may use Shortest Job Next. Thus, queues would be scheduled first according to priority, then according to either a round-robin schedule in the first queue, or by process length in the second queue.

MLFQ is the most complex CPU scheduling algorithm to implement, but has the potential to employ a multitude of other algorithms in order to maximize their benefits while minimizing their drawbacks.

How to use:
First, download every file and make sure you have all the dependencies. Next, open a command console (not powershell) and navigate to the my-next-app folder under nextHello, in the main project folder. Run "npm run dev", wait for it to load, and CTRL+click the Network link. It should open in browser, but make sure to wait for it to compile first!