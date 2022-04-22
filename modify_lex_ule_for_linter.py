with open('./src-hasty.l') as f:
  inputs = f.readlines()

with open('./hasty-for-linter.l','w') as f:
  for line in inputs:
    if ' return' in line:
      inSym, outSym = line.strip().split(' return')
      inSym = inSym.strip()
      if inSym[-1] == '\"':
          outSym = '\''+inSym[1:-1]+'\''
      line =inSym +  '\t\t\t\treturn {type: '+ outSym + ', \'content\':yytext}\n'  
    f.write(line)
