class Pos{
    constructor(a){
        this.end=a;
    }
}

class Edge{
    constructor(root,start,end){
        this.start=start;
        this.end=end;
        this.link=root;
        this.root=root;
        this.index=-1;
        this.child={};
    }

    len(){
        if(this==this.root){
            return 0;
        }
        return this.end.end-this.start+1;
    }

    has(ch){
        return !!this.child[ch];
    }
}

class Tree{

    constructor(text){
        this.text=text;
        this.size=text.length;

        this.activeNode=null;
        this.activeEdge=-1;
        this.activeLen=0;
        this.remain=0;
        this.root=new Edge(null,-1,new Pos(-1));
        this.root.root=this.root;
        this.leafEnd=new Pos(-1);
        this.activeNode=this.root;

        this.build();
        this.setIndex(this.root,0);

    }

    walkDown(node){
        //console.log(node);
        if(this.activeLen>=node.len()){
            this.activeLen-=node.len();
            this.activeEdge+=node.len();
            this.activeNode=node;
            return true;
        }
        return false;
    }

    extend(pos){
        this.remain++;
        let lastNewNode=null;
        this.leafEnd.end=pos;

        while(this.remain>0){
            if(this.activeLen==0){
                this.activeEdge=pos;
            }
            //console.log(this.text[this.activeEdge],this.remain);
            if(!this.activeNode.has(this.text[this.activeEdge])){
                this.activeNode.child[this.text[this.activeEdge]]=new Edge(this.root,pos,this.leafEnd);
                if(lastNewNode){
                    lastNewNode.link=this.activeNode;
                    lastNewNode=null;
                }
            }else{
                let next=this.activeNode.child[this.text[this.activeEdge]];
                //console.log(next);
                if(this.walkDown(next)){
                    continue;
                }
                if(this.text[next.start+this.activeLen]==this.text[pos]){
                    if(!!lastNewNode && this.activeNode!=this.root){
                        lastNewNode.link=this.activeNode;
                        lastNewNode=null;
                    }
                    this.activeLen+=1;
                    break;
                }

                let split=new Edge(this.root,next.start,new Pos(next.start+this.activeLen-1));
                this.activeNode.child[this.text[this.activeEdge]]=split;
                split.child[this.text[pos]]=new Edge(this.root,pos,this.leafEnd);
                next.start+=this.activeLen;
                split.child[this.text[next.start]]=next;
                if(!!lastNewNode){
                    lastNewNode.link=split;
                }
                lastNewNode=split;
            }

            this.remain--;

            if(this.activeNode==this.root && this.activeLen>0){
                this.activeLen--;
                this.activeEdge=pos-this.remain+1;
            }else if(this.activeNode!=this.root){
                this.activeNode=this.activeNode.link;
            }
        }
    }

    build(){
        for(let i=0;i<this.size;i++){
            this.extend(i);
        }
    }
    setIndex(node,height){
        if(!node){
            return;
        }
        let isLeaf=true;
        for(let key of Object.keys(node.child)){
            isLeaf=false;
            this.setIndex(node.child[key],height+node.child[key].len());
        }
        if(isLeaf){
            node.index=this.size-height;
            console.log(node.start,node.end.end,node.index);
        }
        
    }
    traversal(node,sa){
        if(!node) {
            return;
        }
        if(node.index==-1){
            for(let key of Object.keys(node.child).sort()){
                this.traversal(node.child[key],sa);
            }
        }else if(node.index>-1 && node.index<this.size-1){
            sa.push(node.index);
        }
        
    }
    suffix_array(){
        let sa=[];
        this.traversal(this.root,sa);
        return sa;
    }
}
t=new Tree("banana$");
console.log(t.suffix_array());
