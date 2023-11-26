myName = 'EmmanuelOk a is a teacher in a tech hub in a house'
g2 = myName.split('a')

print(g2)
for i in g2:
    if len(i) >=5 and len(i) <=7:
        print(i)

print([i for i in g2 if len(i) >=5 and len(i)<=7])