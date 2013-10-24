class Person
  constructor: (args = {}) ->
    @name = args.name
    @age = args.age

  noSuchMethod: (args) ->
    console.log("You called method #{ args[0] } with params #{ args }, no such method exist")

  sayHi: (var1, var2, var3) ->
    console.log("Saying Hi! #{var1}, #{var2}, #{var3}")

  execute: () ->
    if typeof(this[arguments[0]]) is 'function'
      this[arguments[0]].apply(this, Array.prototype.slice.call(arguments, 1))
    else
      this.noSuchMethod(arguments)

person = new Person({name: 'Leonidas', age:123})

person.execute('sayHi', 1, 2, 3)
person.execute('sayHello', 1, 2, 3)
