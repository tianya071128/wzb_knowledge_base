# Java Programming Demo

<cite>
**Referenced Files in This Document**
- [Main.java](file://demo/java/xuexi/01.基础/01.变量定义/Main.java)
- [Main.java](file://demo/java/xuexi/01.基础/02.数字/Main.java)
- [Main.java](file://demo/java/xuexi/01.基础/03.布尔/Main.java)
- [Main.java](file://demo/java/xuexi/01.基础/04.字符和字符串/Main.java)
- [Main.java](file://demo/java/xuexi/01.基础/05.运算符/Main.java)
- [Main.java](file://demo/java/xuexi/02.流程控制/01.if/Main.java)
- [Main.java](file://demo/java/xuexi/02.流程控制/02.switch/Main.java)
- [Main.java](file://demo/java/xuexi/02.流程控制/03.while循环/Main.java)
- [Main.java](file://demo/java/xuexi/02.流程控制/04.do while循环/Main.java)
- [Main.java](file://demo/java/xuexi/02.流程控制/05.for循环/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/01.数组/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/02.对象/01.基础/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/02.对象/02.继承/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/02.对象/03.抽象类/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/02.对象/04.接口/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/02.Double/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/03.Boolean/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/03.枚举(enum)/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/07.Math(数学计算)/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/08.Random(伪随机数)/Main.java)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/09.SecureRandom(真随机数)/Main.java)
- [Main.java](file://demo/java/xuexi/04.异常处理/01.基础/Main.java)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document presents a structured, progressive Java programming demo designed to teach Java fundamentals and practical patterns. It covers variables and data types, operators, control structures, arrays, classes, inheritance, abstraction, interfaces, core utility classes, and exception handling. Each topic is grounded in real examples from the repository’s Java demos, demonstrating best practices such as immutability, encapsulation, method overloading, and safe use of standard library APIs.

## Project Structure
The Java demos are organized by topic into folders under demo/java/xuexi/. Each topic contains a Main.java file demonstrating a specific concept. The structure supports incremental learning from basic syntax to object-oriented design and standard library usage.

```mermaid
graph TB
subgraph "Java Demo Topics"
A["01.基础<br/>Variables, Numbers, Booleans, Strings, Operators"]
B["02.流程控制<br/>if, switch, while, do-while, for"]
C["03.引用类型<br/>Arrays, Objects, Core Classes"]
D["04.异常处理<br/>try-catch-finally, throws, custom exceptions"]
end
A --> B --> C --> D
```

**Section sources**
- [Main.java:1-1](file://demo/java/xuexi/01.基础/01.变量定义/Main.java#L1-L1)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/01.if/Main.java#L1-L1)
- [Main.java:1-3](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L3)
- [Main.java:1-2](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L2)

## Core Components
This section introduces the foundational building blocks demonstrated in the Java demos.

- Variables and Types
  - Primitive types and literals are introduced with numeric and boolean examples.
  - Strings and characters are covered, including Unicode behavior and immutability.
  - Reference types include arrays and wrapper classes.

- Control Structures
  - Conditional branching with if and switch.
  - Iterative constructs: while, do-while, and for (including enhanced for).

- Arrays
  - Creation via allocation and literal forms.
  - Initialization defaults, indexing, iteration, and sorting utilities.

- Object-Oriented Basics
  - Visibility modifiers, static members, constructors, method overloading, and final semantics.
  - Encapsulation and immutability patterns.

- Core Utility Classes
  - Wrapper types (Integer, Double, Boolean) and their conversion behaviors.
  - String utilities and immutability pitfalls.
  - Enumerations, Math utilities, Random number generation.

- Exception Handling
  - Try-catch-finally, multi-catch, throws declarations, and custom runtime exceptions.

**Section sources**
- [Main.java:1-57](file://demo/java/xuexi/01.基础/02.数字/Main.java#L1-L57)
- [Main.java:1-6](file://demo/java/xuexi/01.基础/03.布尔/Main.java#L1-L6)
- [Main.java:1-30](file://demo/java/xuexi/01.基础/04.字符和字符串/Main.java#L1-L30)
- [Main.java:1-57](file://demo/java/xuexi/01.基础/05.运算符/Main.java#L1-L57)
- [Main.java:1-14](file://demo/java/xuexi/02.流程控制/05.for循环/Main.java#L1-L14)
- [Main.java:1-35](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L35)
- [Main.java:1-81](file://demo/java/xuexi/03.引用类型/02.对象/01.基础/Main.java#L1-L81)
- [Main.java:1-36](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java#L1-L36)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/03.枚举(enum)/Main.java#L62-L62)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/07.Math(数学计算)/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/08.Random(伪随机数)/Main.java#L3-L3)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/09.SecureRandom(真随机数)/Main.java#L3-L3)
- [Main.java:1-56](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L56)

## Architecture Overview
The demos are self-contained single-class programs with a main method per topic. There is no cross-demo dependency; each file demonstrates a concept in isolation. This design emphasizes clarity and progressive learning.

```mermaid
graph TB
subgraph "Demo Files"
F1["基础/变量定义/Main.java"]
F2["基础/数字/Main.java"]
F3["基础/布尔/Main.java"]
F4["基础/字符和字符串/Main.java"]
F5["基础/运算符/Main.java"]
F6["流程控制/if/Main.java"]
F7["流程控制/switch/Main.java"]
F8["流程控制/while循环/Main.java"]
F9["流程控制/do while循环/Main.java"]
F10["流程控制/for循环/Main.java"]
F11["引用类型/数组/Main.java"]
F12["对象/基础/Main.java"]
F13["对象/继承/Main.java"]
F14["对象/抽象类/Main.java"]
F15["对象/接口/Main.java"]
F16["核心类/字符串/Main.java"]
F17["核心类/Integer/Main.java"]
F18["核心类/Double/Main.java"]
F19["核心类/Boolean/Main.java"]
F20["核心类/枚举/Main.java"]
F21["核心类/Math/Main.java"]
F22["核心类/Random/Main.java"]
F23["核心类/SecureRandom/Main.java"]
F24["异常处理/Base/Main.java"]
end
```

**Diagram sources**
- [Main.java:1-1](file://demo/java/xuexi/01.基础/01.变量定义/Main.java#L1-L1)
- [Main.java:1-57](file://demo/java/xuexi/01.基础/02.数字/Main.java#L1-L57)
- [Main.java:1-6](file://demo/java/xuexi/01.基础/03.布尔/Main.java#L1-L6)
- [Main.java:1-30](file://demo/java/xuexi/01.基础/04.字符和字符串/Main.java#L1-L30)
- [Main.java:1-57](file://demo/java/xuexi/01.基础/05.运算符/Main.java#L1-L57)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/01.if/Main.java#L1-L1)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/02.switch/Main.java#L1-L1)
- [Main.java:1-10](file://demo/java/xuexi/02.流程控制/03.while循环/Main.java#L1-L10)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/04.do while循环/Main.java#L1-L1)
- [Main.java:1-14](file://demo/java/xuexi/02.流程控制/05.for循环/Main.java#L1-L14)
- [Main.java:1-35](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L35)
- [Main.java:1-81](file://demo/java/xuexi/03.引用类型/02.对象/01.基础/Main.java#L1-L81)
- [Main.java:1-28](file://demo/java/xuexi/03.引用类型/02.对象/02.继承/Main.java#L1-L28)
- [Main.java:1-21](file://demo/java/xuexi/03.引用类型/02.对象/03.抽象类/Main.java#L1-L21)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/02.对象/04.接口/Main.java#L1-L1)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java#L1-L1)
- [Main.java:1-36](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java#L1-L36)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/02.Double/Main.java#L1-L1)
- [Main.java:1-16](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/03.Boolean/Main.java#L1-L16)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/03.枚举(enum)/Main.java#L62-L62)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/07.Math(数学计算)/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/08.Random(伪随机数)/Main.java#L3-L3)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/09.SecureRandom(真随机数)/Main.java#L3-L3)
- [Main.java:1-56](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L56)

## Detailed Component Analysis

### Variables and Data Types
- Numeric primitives and literals are demonstrated with arithmetic operations and operator precedence.
- Boolean values and logical operators are shown with short-circuit evaluation behavior.
- Characters and strings: Unicode encoding, character arithmetic, string immutability, and comparison pitfalls (use equals, not ==).
- Operators include arithmetic, assignment, relational, logical, and ternary forms.

```mermaid
flowchart TD
Start(["Program Entry"]) --> NumOps["Numeric Operations"]
NumOps --> BoolOps["Boolean and Logical Ops"]
BoolOps --> CharStr["Characters and Strings"]
CharStr --> Compare["Comparison Pitfalls"]
Compare --> End(["Program Exit"])
```

**Diagram sources**
- [Main.java:1-57](file://demo/java/xuexi/01.基础/02.数字/Main.java#L1-L57)
- [Main.java:1-6](file://demo/java/xuexi/01.基础/03.布尔/Main.java#L1-L6)
- [Main.java:1-30](file://demo/java/xuexi/01.基础/04.字符和字符串/Main.java#L1-L30)
- [Main.java:1-57](file://demo/java/xuexi/01.基础/05.运算符/Main.java#L1-L57)

**Section sources**
- [Main.java:1-57](file://demo/java/xuexi/01.基础/02.数字/Main.java#L1-L57)
- [Main.java:1-6](file://demo/java/xuexi/01.基础/03.布尔/Main.java#L1-L6)
- [Main.java:1-30](file://demo/java/xuexi/01.基础/04.字符和字符串/Main.java#L1-L30)
- [Main.java:1-57](file://demo/java/xuexi/01.基础/05.运算符/Main.java#L1-L57)

### Control Structures
- Conditional statements: if and switch with typical patterns.
- Loops: while, do-while, and for (including enhanced for loop for collections/arrays).

```mermaid
flowchart TD
S(["Start Loop"]) --> Cond{"Condition"}
Cond --> |true| Body["Execute Body"]
Body --> Inc["Increment/Update"]
Inc --> Cond
Cond --> |false| E(["End Loop"])
```

**Diagram sources**
- [Main.java:1-10](file://demo/java/xuexi/02.流程控制/03.while循环/Main.java#L1-L10)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/04.do while循环/Main.java#L1-L1)
- [Main.java:1-14](file://demo/java/xuexi/02.流程控制/05.for循环/Main.java#L1-L14)

**Section sources**
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/01.if/Main.java#L1-L1)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/02.switch/Main.java#L1-L1)
- [Main.java:1-10](file://demo/java/xuexi/02.流程控制/03.while循环/Main.java#L1-L10)
- [Main.java:1-1](file://demo/java/xuexi/02.流程控制/04.do while循环/Main.java#L1-L1)
- [Main.java:1-14](file://demo/java/xuexi/02.流程控制/05.for循环/Main.java#L1-L14)

### Arrays
- Array creation via allocation and literal forms.
- Default initialization, length property, indexing, and bounds checking.
- Traversal using classic for and enhanced for loops.
- Sorting with Arrays.sort and Collections.reverseOrder for objects.

```mermaid
flowchart TD
AStart(["Array Demo Entry"]) --> Alloc["Allocate Array"]
Alloc --> Init["Default Values"]
Init --> Traverse["Traverse with for/for-each"]
Traverse --> Sort["Sort with Arrays.sort"]
Sort --> AEnd(["Array Demo Exit"])
```

**Diagram sources**
- [Main.java:1-35](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L35)

**Section sources**
- [Main.java:1-35](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L35)

### Object-Oriented Programming Fundamentals
- Visibility modifiers, static vs instance members, constructors, method overloading, and final semantics.
- Encapsulation and immutability patterns are illustrated through field visibility and immutable wrappers.

```mermaid
classDiagram
class City {
+String name
-int population
#int area
+final int code
+static int count
+City(name)
+City(name, population)
+void setPopulation(age, ...ages)
+final void setArea(area)
+static void addCount()
}
```

**Diagram sources**
- [Main.java:1-81](file://demo/java/xuexi/03.引用类型/02.对象/01.基础/Main.java#L1-L81)

**Section sources**
- [Main.java:1-81](file://demo/java/xuexi/03.引用类型/02.对象/01.基础/Main.java#L1-L81)

### Inheritance
- Single inheritance using extends.
- Access restrictions (private members not accessible).
- Using super to call parent constructor and members.

```mermaid
classDiagram
class City
class ChinaCity {
+ChinaCity(name)
}
City <|-- ChinaCity : "extends"
```

**Diagram sources**
- [Main.java:1-81](file://demo/java/xuexi/03.引用类型/02.对象/01.基础/Main.java#L1-L81)
- [Main.java:1-28](file://demo/java/xuexi/03.引用类型/02.对象/02.继承/Main.java#L1-L28)

**Section sources**
- [Main.java:1-28](file://demo/java/xuexi/03.引用类型/02.对象/02.继承/Main.java#L1-L28)

### Abstraction
- Abstract classes cannot be instantiated.
- Abstract methods must be implemented by subclasses.

```mermaid
classDiagram
class AbstractCity {
<<abstract>>
+String name
+setName(name)
+setPopulation(population)*
}
```

**Diagram sources**
- [Main.java:1-21](file://demo/java/xuexi/03.引用类型/02.对象/03.抽象类/Main.java#L1-L21)

**Section sources**
- [Main.java:1-21](file://demo/java/xuexi/03.引用类型/02.对象/03.抽象类/Main.java#L1-L21)

### Interfaces
- Interfaces define contracts for implementation.
- Example file exists for interface demonstration.

```mermaid
classDiagram
class InterfaceContract {
<<interface>>
+methodSignature()
}
```

**Diagram sources**
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/02.对象/04.接口/Main.java#L1-L1)

**Section sources**
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/02.对象/04.接口/Main.java#L1-L1)

### Core Utility Classes
- Wrapper types: Integer, Double, Boolean, with boxing/unboxing and conversion methods.
- String: immutability, equals vs ==, and multi-line string literals.
- Enumerations, Math utilities, Random and SecureRandom for pseudo- and true randomness.

```mermaid
classDiagram
class IntegerWrapper {
+Integer valueOf(int)
+intValue()
+equals(Object)
}
class StringClass {
+equals(Object)
+compareTo(String)
}
class BooleanWrapper {
+parseBoolean(String)
}
class MathUtils {
+abs(double)
+max(int, int)
}
class RandomGen {
+nextInt()
}
class SecureRandomGen {
+nextBytes(byte[])
}
```

**Diagram sources**
- [Main.java:1-36](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java#L1-L36)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/02.Double/Main.java#L1-L1)
- [Main.java:1-16](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/03.Boolean/Main.java#L1-L16)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/03.枚举(enum)/Main.java#L62-L62)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/07.Math(数学计算)/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/08.Random(伪随机数)/Main.java#L3-L3)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/09.SecureRandom(真随机数)/Main.java#L3-L3)

**Section sources**
- [Main.java:1-36](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java#L1-L36)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/02.Double/Main.java#L1-L1)
- [Main.java:1-16](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/03.Boolean/Main.java#L1-L16)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/03.枚举(enum)/Main.java#L62-L62)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/07.Math(数学计算)/Main.java#L1-L1)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/08.Random(伪随机数)/Main.java#L3-L3)
- [Main.java](file://demo/java/xuexi/03.引用类型/03.核心类/09.SecureRandom(真随机数)/Main.java#L3-L3)

### Exception Handling
- Try-catch-finally blocks, multi-catch, throws declarations, and throwing exceptions.
- Custom runtime exception hierarchy.

```mermaid
sequenceDiagram
participant Main as "Main.main"
participant TryBlock as "Try Block"
participant CatchBlock as "Catch Block(s)"
participant FinallyBlock as "Finally Block"
Main->>TryBlock : Execute risky code
TryBlock-->>CatchBlock : Throws NullPointerException or NumberFormatException
CatchBlock-->>Main : Handle and print stack trace
Main->>FinallyBlock : Always executes
FinallyBlock-->>Main : Cleanup
```

**Diagram sources**
- [Main.java:1-56](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L56)

**Section sources**
- [Main.java:1-56](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L56)

## Dependency Analysis
- Cohesion: Each demo file focuses on a single concept, ensuring high cohesion.
- Coupling: No inter-demo dependencies; files are independent.
- External dependencies: Standard library usage (java.util.*, java.io.* for I/O demos).

```mermaid
graph LR
Arrays["Arrays Demo"] --- Util["java.util.Arrays"]
Strings["Strings Demo"] --- Lang["java.lang.String"]
Wrappers["Wrappers Demo"] --- LangWrap["java.lang.Integer/Double/Boolean"]
IOBase["I/O Base Demo"] --- IO["java.io.IOException"]
```

**Diagram sources**
- [Main.java:1-3](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L3)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java#L1-L1)
- [Main.java:1-36](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java#L1-L36)
- [Main.java:1-2](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L2)

**Section sources**
- [Main.java:1-3](file://demo/java/xuexi/03.引用类型/01.数组/Main.java#L1-L3)
- [Main.java:1-1](file://demo/java/xuexi/03.引用类型/03.核心类/01.字符串/Main.java#L1-L1)
- [Main.java:1-36](file://demo/java/xuexi/03.引用类型/03.核心类/02.包装类型/01.Integer/Main.java#L1-L36)
- [Main.java:1-2](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L2)

## Performance Considerations
- Prefer enhanced for loops for readability and reduced error risk.
- Use StringBuilder for repeated string concatenations.
- Avoid unnecessary boxing/unboxing in tight loops; use primitive streams where applicable.
- Minimize allocations inside loops; reuse objects when safe.

## Troubleshooting Guide
- NullPointerException: occurs when dereferencing null references; handle with try-catch or preconditions.
- ArrayIndexOutOfBoundsException: indicates invalid array indices; validate bounds before access.
- ClassCastException: misuse of casting; ensure type compatibility or use instanceof checks.
- Misusing == with strings: always use equals for content comparison.
- Inheritance access violations: remember private members are not inherited.

**Section sources**
- [Main.java:1-56](file://demo/java/xuexi/04.异常处理/01.基础/Main.java#L1-L56)
- [Main.java:1-30](file://demo/java/xuexi/01.基础/04.字符和字符串/Main.java#L1-L30)

## Conclusion
The Java demos provide a clear, incremental pathway through core language features and OOP principles, supported by practical examples and standard library usage. Learners can progress from basic syntax to classes, inheritance, abstraction, interfaces, and robust error handling, all while observing idiomatic Java practices such as immutability, encapsulation, and safe API usage.