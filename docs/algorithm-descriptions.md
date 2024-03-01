# Algorithm Descriptions

### Greedy Algorithm: 
Produces a matching that has maximum cardinality, and subject to this, maximises the number of first choices, and subject to this, maximises the number of second choices, etc.


### Generous Algorithm: 
Produces a matching that has maximum cardinality, and subject to this, minimises the number of Rth choices, and subject to this, minimises the number of (R-1)th choices, etc., where R is the maximum length of a preference list.


### Greedy-generous Algorithm: 
Produces a greedy maximum matching relative to the first k elements on every student’s preference list, where k is the maximum integer such that some agent obtains their kth choice project in a generous maximum matching.


### Minimum Cost Algorithm: 
Produces a maximum cardinality matching that has minimum cost, where the cost of a matching is the sum, taken over all matched students, of the rank of each student’s assigned project in their preference list.

