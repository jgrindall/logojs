package com.jgrindall.antlrtut.java.visit;

	import com.jgrindall.antlrtut.java.error.*;
	import com.jgrindall.antlrtut.java.interfaces.IOutput;
	import com.jgrindall.antlrtut.java.nodes.*;
	import com.jgrindall.antlrtut.java.sym.*;
import com.jgrindall.antlrtut.java.utils.APoint;
	import com.jgrindall.antlrtut.java.utils.FunctionWrapper;
	import org.antlr.runtime.*;

import java.awt.Point;
	import java.util.Stack;
import java.util.Vector;
	
	public class Visitor {

		private Stack<Object> stack = new Stack<Object>();
		private ISymbolTable symTable = new SymbolTable();
		private ProgNode root;
		private IOutput output;
		public static final double MAX_NUMBER = 4294967296.0;
		
		public Visitor(){
			
		}
		
		public void init(IOutput o) throws ParseException {
			this.output = o;
			if(root!=null){
				this.visit(root,output);
			}
		}
		public void setRoot( ProgNode root){
			this.root = root;
		}
		public Object visit (ANode node, IOutput o) throws ParseException{
			System.out.println("visit "+node);
			if(node instanceof DivideTermNode){
				return visitDivideTermNode( (DivideTermNode)node,o);
			}
			else if(node instanceof ExpressionNode){
				return visitBasic(node ,o);
			}
			else if(node instanceof ForwardNode){
				return visitForwardNode((ForwardNode)node  ,o);
			}
			else if(node instanceof MinusExpressionNode){
				return visitMinusExpressionNode((MinusExpressionNode)node  ,o);
			}
			else if(node instanceof MultExpressionNode){
				return visitBasic(node  ,o);
			}
			else if(node instanceof NegateNode){
				return visitNegateNode((NegateNode)node  ,o);
			}
			else if(node instanceof NumberExpressionNode){
				return visitBasic(node  ,o);
			}
			else if(node instanceof PlusExpressionNode){
				return visitPlusExpressionNode((PlusExpressionNode)node  ,o);
			}
			else if(node instanceof ProgNode){
				return visitProgNode((ProgNode)node  ,o);
			}
			else if(node instanceof StatementListNode){
				return visitBasic(node ,o);
			}
			else if(node instanceof StatementNode){
				return visitBasic(node ,o);
			}
			else if(node instanceof TimesTermNode){
				return visitTimesTermNode((TimesTermNode)node  ,o);
			}
			else if(node instanceof UnaryNode){
				return visitBasic(node  ,o);
			}
			else if(node instanceof NumberNode){
				return visitNumberNode((NumberNode)node   ,o);
			}
			else if(node instanceof RightNode){
				return visitRightNode((RightNode)node    ,o);
			}
			else if(node instanceof RptNode){
				return visitRptNode((RptNode)node   ,o);
			}
			else if(node instanceof VarNameNode){
				return visitVarNameNode((VarNameNode)node  ,o);
			}
			else if(node instanceof VarDefnNode){
				return visitVarDefnNode((VarDefnNode)node   ,o);
			}
			else if(node instanceof MakeStatementNode){
				return visitMakeStatementNode((MakeStatementNode)node ,o);
			}
			else if(node instanceof DefineFnStatementNode){
				return visitDefineFnStatementNode((DefineFnStatementNode)node ,o);
			}
			else if(node instanceof FnCallStatementNode){
				return visitFnCallStatementNode((FnCallStatementNode)node ,o);
			}
			else if(node instanceof HomeNode){
				return visitHomeNode((HomeNode)node ,o);
			}
			else if(node instanceof ColorNode){
				return visitColorNode((ColorNode)node,o);
			}
			else if(node instanceof ResetNode){
				return visitResetNode((ResetNode)node,o);
			}
			else if(node instanceof PenUpNode){
				return visitPenUpNode((PenUpNode)node,o);
			}
			else if(node instanceof PenDownNode){
				return visitPenDownNode((PenDownNode)node,o);
			}
			else if(node instanceof MoveToNode){
				return visitMoveToNode((MoveToNode)node,o);
			}
			else if(node instanceof ClearNode){
				return visitClearNode((ClearNode)node,o);
			}
			else{
				return visitBasic(node  ,o);
			}
		}
		public Object visitBasic (ANode node, IOutput o) throws ParseException{
			//trace("visit basic "+node);
			node.visitChildren(this, o);
			o.check();
			return null;
		}
		
		
		
		public Object visitMoveToNode (MoveToNode node, IOutput o) throws ParseException {
			node.visitChildren(this, o);
			Double xNum = this.getDouble();
			Double yNum = this.getDouble();
			o.out(new LogoObject(LogoObject.MOVE_TO,new APoint(xNum,yNum)));
			o.check();
			return null;
		}
		public Object visitHomeNode (HomeNode node, IOutput o) throws ParseException {
			//trace("visit fd");
			node.visitChildren(this, o);
			o.out(new LogoObject(LogoObject.HOME));
			o.check();
			return null;
		}
		public Object visitClearNode (ClearNode node, IOutput o) throws ParseException {
			//trace("visit fd");
			node.visitChildren(this, o);
			o.out(new LogoObject(LogoObject.CLEAR));
			o.check();
			return null;
		}
		public Object visitColorNode (ColorNode node, IOutput o) throws ParseException {
			//trace("visit fd");
			node.visitChildren(this, o);
			o.out(new LogoObject(LogoObject.COLOR,node.getColor()));
			o.check();
			return null;
		}
		public Object visitResetNode (ResetNode node, IOutput o) throws ParseException {
			//trace("visit fd");
			node.visitChildren(this, o);
			o.out(new LogoObject(LogoObject.RESET));
			o.check();
			return null;
		}
		public Object visitPenUpNode (PenUpNode node, IOutput o) throws ParseException {
			//trace("visit fd");
			node.visitChildren(this, o);
			o.out(new LogoObject(LogoObject.PEN_UP));
			o.check();
			return null;
		}
		public Object visitPenDownNode (PenDownNode node, IOutput o) throws ParseException {
			//trace("visit fd");
			node.visitChildren(this, o);
			o.out(new LogoObject(LogoObject.PEN_DOWN));
			o.check();
			return null;
		}
		
		
		
		
		public Object visitDefineFnStatementNode(DefineFnStatementNode node, IOutput o) throws ParseException{
			FnNameNode fnNameNode = (FnNameNode)node.getChildAt(0);
			String fnName = fnNameNode.getName();
			Boolean params = node.getHasParams();
			VarListNode varList;
			InsideFnStatementListNode statements;
			if(params!=null){
				varList = (VarListNode)node.getChildAt(1);
				statements = (InsideFnStatementListNode)node.getChildAt(2);
			}
			else{
				varList = null;
				statements = (InsideFnStatementListNode)node.getChildAt(1);
			}
			symTable.addFunction (fnName, varList, statements);
			o.check();
			return null;
		}
		public Object visitFnCallStatementNode(FnCallStatementNode node, IOutput o)  throws ParseException{
			node.visitChildren(this, o);
			executeFunction(node,o);
			return null;
		}
		public void executeFunction(FnCallStatementNode node, IOutput o) throws ParseException{
			FnNameNode fnNameNode = (FnNameNode)node.getChildAt(0) ;
			String fnName = fnNameNode.getName();
			Token token = node.getToken();
			FunctionWrapper fw = symTable.lookUpFn(fnName);
			VarListNode varList = (VarListNode)fw.vars;
			InsideFnStatementListNode statements = (InsideFnStatementListNode)fw.statements;
			try{
				symTable.enterBlock();
			}
			catch(SymTableException e){
				System.out.println("token "+token);
				ErrorObject obj = new ErrorObject(0,0,"Sym table exception");
				if(token!=null){
					obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Sym table exception");
				}
				throw new ParseException(obj);
			}
			Vector<Double> params = new Vector<Double>();
			while(stack.size()>=1){
				Double  p = getDouble();
				params.add(p);
			}
			for(int i=0;i<=params.size()-1;i++){
				VarNameNode vn = (VarNameNode)varList.getChildAt(i);
				String varname = vn.getName();
				Double val = params.elementAt(params.size()-1-i);
				try{
					symTable.add(varname, val);
				}
				catch(SymTableException e){
					
				}
			}
			visit(statements,o);
			try{
				symTable.exitBlock();
			}
			catch(SymTableException e){
				
			}
		}
		private Double getDouble(){
			return Double.parseDouble(stack.pop().toString());
		}
		public Object visitMakeStatementNode(MakeStatementNode node,IOutput o)  throws ParseException{
			node.visitChildren(this, o);
			Double value = getDouble();
			String varname = new String( stack.pop().toString() );
			try{
				symTable.add(varname,value);
			}
			catch(SymTableException e){
				
			}
			o.check();
			//stack.output();
			return null;
		}
		public Object visitVarNameNode(VarNameNode node,IOutput o) throws ParseException{
			Token token = node.getToken();
			node.visitChildren(this, o);
			String varname = node.getName();
			try{
				Object lookUp = symTable.lookup(varname);
				if(lookUp==null){
					throw new ParseException(new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Variable " + varname + " not found"));
				}
				Double val = Double.parseDouble(lookUp.toString());
				//trace("push var name "+val);
				stack.add(val);
				//stack.output();
				o.check();
				return null;
			}
			catch(SymTableException e){
				throw new ParseException(new ErrorObject(token.getLine(),token.getCharPositionInLine(),""));
			}
		}
		
		public Object visitVarDefnNode(VarDefnNode node,IOutput o) throws ParseException{
			// reading a variable.
			//trace("var defn");
			node.visitChildren(this, o);
			String name = node.getName();
			//trace("pushing..."+name);
			stack.add(name);
			//stack.output();
			o.check();
			return null;
		}
		
		
		public Object visitDivideTermNode (DivideTermNode node, IOutput o)  throws ParseException{
			//trace("visit divide");
			node.visitChildren(this, o);
			ErrorObject obj;
			Double i1 = getDouble();
			Double i2 = getDouble();
			Token token = node.getToken();
			//trace(i1,i2);
			if(i1==0){
				obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Division by zero");
				throw new ParseException(obj);
			}
			Double t = i2/i1;
			if(Math.abs(t)<Visitor.MAX_NUMBER){
				stack.push(t);
			}
			else{
				obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Overflow "+t);
				throw new ParseException(obj);
			}
			stack.push(t);
			//stack.output();
			o.check();
			return null;
		}
		public Object visitForwardNode (ForwardNode node, IOutput o)  throws ParseException{
			node.visitChildren(this, o);
			Double i1 = getDouble();
			System.out.println("-->>  fd "+i1);
			o.out(new LogoObject(LogoObject.FD,i1));
			o.check();
			return null;
		}
		public Object visitRightNode (RightNode node, IOutput o)  throws ParseException{
			node.visitChildren(this, o);
			Double i1 = getDouble();
			System.out.println("-->>  rt "+i1);
			o.out(new LogoObject(LogoObject.RT,i1));
			o.check();
			return null;
		}
		public Object visitRptNode (RptNode node, IOutput o)  throws ParseException{
			//trace("visit rpt");
			ExpressionNode loopNumNode  = (ExpressionNode)node.getChildAt(0) ;
			loopNumNode.visitMe(this,o);
			Double n = getDouble();
			InsideFnStatementListNode statementListNode  = (InsideFnStatementListNode)node.getChildAt(1) ;
			for(int i=1;i<=n;i++){
				statementListNode.visitMe(this,o);
			}
			o.check();
			return null;
		}
		public Object visitMinusExpressionNode (MinusExpressionNode node, IOutput o)  throws ParseException{
			//trace("visit minus");
			node.visitChildren(this, o);
			ErrorObject obj;
			Token token = node.getToken();
			Double i1 = getDouble();
			Double i2 = getDouble();
			Double t = i2-i1;
			if(Math.abs(t)<Visitor.MAX_NUMBER){
				stack.push(t);
			}
			else{
				obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Overflow "+t);
				throw new ParseException(obj);
			}
			stack.push(t);
			o.check();
			return null;
		}
		public Object visitNegateNode (NegateNode node, IOutput o)  throws ParseException{
			//trace("visit neg");
			node.visitChildren(this, o);
			Double i1 = getDouble();
			stack.push(-1*i1);
			o.check();
			return null;
		}
		
		public Object visitNumberNode (NumberNode node, IOutput o)  throws ParseException{
			System.out.println("nn "+node);
			node.visitChildren(this, o);
			stack.push(node.getNumber());
			System.out.println("nn "+node.getNumber());
			o.check();
			System.out.println("nn done");
			return null;
		}
		public Object visitPlusExpressionNode (PlusExpressionNode node, IOutput o)  throws ParseException{
			//trace("visit plus");
			node.visitChildren(this, o);
			ErrorObject obj;
			Token token = node.getToken();
			Double i1 = getDouble();
			Double i2 = getDouble();
			//trace("plus i1,i2",i1,i2);
			Double t = i1+i2;
			if( Math.abs(t)<Visitor.MAX_NUMBER){
				stack.push(t);
			}
			else{
				obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Overflow "+t);
				throw new ParseException(obj);
			}
			o.check();
			return null;
		}
		public Object visitProgNode (ProgNode node, IOutput o)  throws ParseException{
			Token token = node.getToken();
			try{
				symTable.enterBlock();
			}
			catch(SymTableException e){
				ErrorObject obj;
				if(token==null){
					obj = new ErrorObject(0,0,"sym table exception");
				}
				else{
					obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"sym table exception");
				}
				throw new ParseException(obj);
			}
			node.visitChildren(this, o);
			o.check();
			return null;
		}
		
		public Object visitTimesTermNode (TimesTermNode node, IOutput o)  throws ParseException{
			//trace("visit times");
			node.visitChildren(this, o);
			ErrorObject obj;
			Token token = node.getToken();
			Double i1 = getDouble();
			Double i2 = getDouble();
			//trace("times, push",i1,i2);
			Double t = i1*i2;
			if(Math.abs(t)<Visitor.MAX_NUMBER){
				stack.push(t);
			}
			else{
				obj = new ErrorObject(token.getLine(),token.getCharPositionInLine(),"Overflow "+t);
				throw new ParseException(obj);
			}
			o.check();
			return null;
		}
	}
	
