// Publish only the built browser app, preserving the existing gh-pages history.
// Does not enable Pages, change repository visibility, or force-push any branch.
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const git=(args,options={})=>execFileSync('git',args,{encoding:'utf8',...options}).trim();
const root=git(['rev-parse','--show-toplevel']);
const dist=resolve(root,'dist');
if(!existsSync(join(dist,'sw.js')))throw Error('Run npm run build before publishing.');
const branch='gh-pages';
const head=git(['ls-remote','--heads','origin',`refs/heads/${branch}`]).split(/\s/)[0];
if(head)git(['fetch','--no-tags','origin',branch]);
const temp=mkdtempSync(join(tmpdir(),'laeringsreisen-publish-'));
try{
 const env={...process.env,GIT_INDEX_FILE:join(temp,'index'),GIT_WORK_TREE:dist,GIT_DIR:git(['rev-parse','--absolute-git-dir'])};
 const options={cwd:dist,env};
 git(['read-tree','--empty'],options);
 git(['add','--all'],options);
 const tree=git(['write-tree'],options);
 const commit=git(['commit-tree',tree,...(head?['-p',head]:[]),'-m','Publish Læringsreisen browser app'],options);
 git(['push','origin',`${commit}:refs/heads/${branch}`]);
 console.log('Browser build uploaded to gh-pages:',commit);
 console.log('Enable Settings → Pages → Deploy from a branch → gh-pages → /(root).');
}finally{rmSync(temp,{recursive:true,force:true});}
