(this.webpackJsonp=this.webpackJsonp||[]).push([[16],{1193:function(e,t,n){"use strict";n.d(t,"a",(function(){return v}));var a=n(0),o=n.n(a),r=n(220),l=n(3),c=n(17),s=n(37),u=n(29),i=n(1173),m=n(1182),d=n(80),k=n(1166),b=n(1183),f=n(1168),p=n(1175),T=n(73),O=n(1169),y=function(e){var t=e.state,n=e.emptyText,l=e.Item,c=Object(a.useCallback)((function(e){var n=e.item;return o.a.createElement(l,{key:n.symbol,token:n,selected:!1,onSelectToken:t.setSelectedLPToken})}),[t.setSelectedLPToken]),s=t.lpTokens.sort((function(e,t){var n=e.multiplier||0,a=t.multiplier||0;return n===a?(t.apy||0)-(e.apy||0):a-n}));return t.loading?o.a.createElement(b.a,null):0===s.length?o.a.createElement(j,{text:n}):o.a.createElement(r.a,{keyExtractor:function(e){return e.symbol},data:s,renderItem:c})},j=function(e){var t=e.text;return o.a.createElement(l.a,{style:{margin:c.g.normal}},o.a.createElement(T.a,{disabled:!0,style:{textAlign:"center",width:"100%"}},t))},v=function(e){var t=Object(s.a)().textMedium,n=Object(u.d)(e.token.balance,e.token.decimals,6),r=Object(a.useCallback)((function(){e.onSelectToken(e.token)}),[e.onSelectToken,e.token]);return o.a.createElement(f.a,{selected:e.selected,onPress:r,containerStyle:{marginBottom:k.a}},o.a.createElement(d.a,{style:{alignItems:"center"}},o.a.createElement(O.a,{token:e.token.tokenA,small:!0,replaceWETH:!0}),o.a.createElement(O.a,{token:e.token.tokenB,small:!0,replaceWETH:!0,style:{marginLeft:4}}),o.a.createElement(T.a,{medium:!0,caption:!0,style:{marginLeft:c.g.tiny}},e.token.tokenA.symbol,"-",e.token.tokenB.symbol),o.a.createElement(l.a,{style:{flex:1,marginLeft:c.g.tiny}},o.a.createElement(T.a,{caption:!0,light:!0,style:{textAlign:"right",color:t}},n)),e.selected?!e.viewOnly&&o.a.createElement(i.a,null):o.a.createElement(p.a,null)))};t.b=function(e){return o.a.createElement(l.a,{style:e.style},o.a.createElement(m.a,{title:e.title,expanded:!e.state.selectedLPToken,viewOnly:e.viewOnly,onExpand:function(){return e.state.setSelectedLPToken()}},o.a.createElement(y,{state:e.state,emptyText:e.emptyText,Item:e.Item})),e.state.selectedLPToken&&o.a.createElement(e.Item,{token:e.state.selectedLPToken,selected:!0,viewOnly:e.viewOnly,onSelectToken:e.disabled?function(){}:function(){return e.state.setSelectedLPToken()}}))}},1194:function(e,t,n){"use strict";var a=n(6),o=n.n(a),r=n(4),l=n.n(r),c=n(16),s=n.n(c),u=n(0),i=n(127),m=n.n(i),d=n(51),k=n(301),b=n(1186),f=n(394),p=n(1199);function T(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?T(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):T(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var y=!1;t.a=function(e){var t=Object(p.a)(),n=Object(u.useContext)(d.b),a=n.provider,o=n.address,r=n.tokens,c=Object(u.useState)(0),i=s()(c,2),T=i[0],j=i[1],v=Object(u.useState)(!0),E=s()(v,2),P=E[0],g=E[1],L=Object(u.useState)([]),x=s()(L,2),w=x[0],S=x[1],h=Object(u.useState)(),A=s()(h,2),B=A[0],I=A[1],D=Object(u.useState)(!1),q=s()(D,2),C=q[0],H=q[1],R=Object(u.useState)(),F=s()(R,2),W=F[0],J=F[1],M=Object(u.useState)(""),N=s()(M,2),z=N[0],G=N[1],K=Object(f.a)().getPair,Q=function(){var t;return l.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(o&&a&&r.length>0)||y){n.next=11;break}return n.prev=1,y=!0,n.next=5,l.a.awrap("my-pools"===e?Object(k.c)(o,r,a):"pools"===e?Object(k.d)(o,r,a):Object(k.b)(o,r,a));case 5:(t=n.sent)&&S(t);case 7:return n.prev=7,y=!1,g(!1),n.finish(7);case 11:case"end":return n.stop()}}),null,null,[[1,,7,11]],Promise)};return Object(u.useEffect)((function(){B||G("")}),[B]),m()((function(){return l.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(g(!0),J(void 0),!B||!a){e.next=18;break}return e.prev=3,e.t0=J,e.next=7,l.a.awrap(K(B.tokenA,B.tokenB,a));case 7:e.t1=e.sent,(0,e.t0)(e.t1),e.next=13;break;case 11:e.prev=11,e.t2=e.catch(3);case 13:return e.prev=13,g(!1),e.finish(13);case 16:e.next=19;break;case 18:g(!1);case 19:case"end":return e.stop()}}),null,null,[[3,11,13,16]],Promise)}),[B,a]),Object(b.a)((function(t){return l.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(!o||!("pools"===e||r.length>0)){n.next=4;break}return t||g(!0),n.next=4,l.a.awrap(Q());case 4:case"end":return n.stop()}}),null,null,null,Promise)}),(function(){return"updateLPTokens()"}),[r.length,o,T],0),O(O({},t),{},{fromToken:t.fromToken||(null==B?void 0:B.tokenA),toToken:t.toToken||(null==B?void 0:B.tokenB),updateLPTokens:Q,loading:t.loading||P,lastTimeRefreshed:T,updateLastTimeRefreshed:function(){j(Date.now())},lpTokens:w,selectedLPToken:B,setSelectedLPToken:I,selectedLPTokenAllowed:C,setSelectedLPTokenAllowed:H,pair:W,amount:z,setAmount:G})}},1311:function(e,t,n){"use strict";n.r(t),n.d(t,"LPTokenOutputItem",(function(){return ne}));var a=n(16),o=n.n(a),r=n(0),l=n.n(r),c=n(7),s=n(3),u=n(127),i=n.n(u),m=n(1180),d=n(1181),k=n(386),b=n(1171),f=n(299),p=n(1172),T=n(1173),O=n(387),y=n(388),j=n(1176),v=n(1177),E=n(80),P=n(1165),g=n(1178),L=n(1174),x=n(1166),w=n(1193),S=n(1184),h=n(1168),A=n(1175),B=n(73),I=n(389),D=n(1185),q=n(1169),C=(n(1188),n(392)),H=n(390),R=n(1191),F=n(300),W=n(17),J=n(51),M=n(6),N=n.n(M),z=n(4),G=n.n(z),K=n(28),Q=n(29),U=n(1194),V=n(1209),X=n(1227);function Y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function Z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Y(Object(n),!0).forEach((function(t){N()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Y(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var $=function(){var e=Object(U.a)("my-lp-tokens"),t=Object(r.useContext)(J.b),n=t.provider,a=t.signer,l=t.getTokenAllowance,c=t.updateTokens,s=Object(V.a)(),u=s.removeLiquidity,m=s.removeLiquidityETH,d=Object(X.a)().zapOut,k=Object(r.useState)(!1),b=o()(k,2),f=b[0],p=b[1],T=Object(r.useState)(),O=o()(T,2),y=O[0],j=O[1],v=Object(r.useState)(!1),E=o()(v,2),P=E[0],g=E[1];i()((function(){var t,n;return G.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:if(!a||!e.selectedLPToken){o.next=16;break}return e.setFromSymbol(e.selectedLPToken.tokenA.symbol),e.setToSymbol(e.selectedLPToken.tokenB.symbol),p(!0),e.setSelectedLPTokenAllowed(!1),o.prev=5,t=K.ethers.BigNumber.from(2).pow(96).sub(1),o.next=9,G.a.awrap(l(e.selectedLPToken.address,F.e));case 9:n=o.sent,e.setSelectedLPTokenAllowed(K.ethers.BigNumber.from(n).gte(t));case 11:return o.prev=11,p(!1),o.finish(11);case 14:o.next=18;break;case 16:e.setFromSymbol(""),e.setToSymbol("");case 18:case"end":return o.stop()}}),null,null,[[5,,11,14]],Promise)}),[a,e.selectedLPToken]),i()((function(){var t,n;return G.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:e.selectedLPToken&&e.selectedLPToken.totalSupply&&e.pair&&e.fromToken&&e.toToken&&e.pair.liquidityToken.address===e.selectedLPToken.address&&(t=Object(Q.m)(e.pair.reserveOf(Object(Q.b)(e.fromToken)),e.fromToken.decimals),n=Object(Q.m)(e.pair.reserveOf(Object(Q.b)(e.toToken)),e.toToken.decimals),e.setFromAmount(Object(Q.d)(Object(Q.l)(e.amount,e.selectedLPToken.decimals).mul(t).div(e.selectedLPToken.totalSupply).toString(),e.selectedLPToken.tokenA.decimals)),e.setToAmount(Object(Q.d)(Object(Q.l)(e.amount,e.selectedLPToken.decimals).mul(n).div(e.selectedLPToken.totalSupply).toString(),e.selectedLPToken.tokenB.decimals)));case 1:case"end":return a.stop()}}),null,null,null,Promise)}),[e.selectedLPToken,e.amount,e.pair,e.fromToken,e.toToken,a]);var L=function(){var t,n,o,r,l,c,s,i;return G.a.async((function(d){for(;;)switch(d.prev=d.next){case 0:if(!e.selectedLPToken||!a){d.next=20;break}if(t=Object(Q.l)(e.fromAmount,e.fromToken.decimals),n=Object(Q.l)(e.toAmount,e.toToken.decimals),o=Object(Q.l)(e.amount,e.selectedLPToken.decimals),!Object(Q.k)(e.fromToken)&&!Object(Q.k)(e.toToken)){d.next=15;break}return r=Object(Q.k)(e.fromToken)?e.toToken:e.fromToken,l=Object(Q.k)(e.fromToken)?n:t,c=Object(Q.k)(e.fromToken)?t:n,d.next=10,G.a.awrap(m(r,o,l,c,a));case 10:return s=d.sent,d.next=13,G.a.awrap(s.wait());case 13:d.next=20;break;case 15:return d.next=17,G.a.awrap(u(e.fromToken,e.toToken,o,t,n,a));case 17:return i=d.sent,d.next=20,G.a.awrap(i.wait());case 20:case"end":return d.stop()}}),null,null,null,Promise)},x=Object(r.useCallback)((function(){return G.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e.fromAmount&&e.toAmount&&e.selectedLPToken&&e.amount&&n&&a)){t.next=13;break}return g(!0),t.prev=2,t.next=5,G.a.awrap(L());case 5:return t.next=7,G.a.awrap(c());case 7:return t.next=9,G.a.awrap(e.updateLPTokens());case 9:e.setSelectedLPToken(void 0);case 10:return t.prev=10,g(!1),t.finish(10);case 13:case"end":return t.stop()}}),null,null,[[2,,10,13]],Promise)}),[e.fromAmount,e.toAmount,e.selectedLPToken,e.amount,e.updateLPTokens,L,d,c,n,a]);return Z(Z({},e),{},{loading:e.loading||f,outputToken:y,setOutputToken:j,onRemove:x,removing:P})},_=n(54),ee=n(391),te=function(){var e=Object(r.useContext)(J.b).chainId,t=Object(_.a)(),n=$();return 1!==e?l.a.createElement(p.a,null):l.a.createElement(s.a,{style:{marginTop:W.g.large}},l.a.createElement(w.b,{state:n,title:t("your-liquidity"),emptyText:t("you-dont-have-liquidity"),Item:w.a}),l.a.createElement(b.a,null),l.a.createElement(ae,{state:n}),l.a.createElement(oe,{state:n}))},ne=function(e){return e.hidden?l.a.createElement(s.a,null):l.a.createElement(h.a,{selected:e.selected,onPress:e.onSelectToken,containerStyle:{marginBottom:x.a}},l.a.createElement(E.a,{style:{alignItems:"center"}},l.a.createElement(q.a,{token:e.token.tokenA,small:!0,replaceWETH:!0}),l.a.createElement(q.a,{token:e.token.tokenB,small:!0,replaceWETH:!0,style:{marginLeft:4}}),l.a.createElement(B.a,{medium:!0,caption:!0,style:{marginLeft:W.g.tiny}},e.token.tokenA.symbol," + ",e.token.tokenB.symbol),l.a.createElement(s.a,{style:{flex:1}}),e.selected?l.a.createElement(T.a,null):l.a.createElement(A.a,null)))},ae=function(e){var t=e.state,n=Object(_.a)();return t.selectedLPToken?l.a.createElement(D.a,{title:n("amount-of-tokens"),token:t.selectedLPToken,amount:t.amount,onAmountChanged:t.setAmount}):l.a.createElement(P.a,{text:n("amount-of-tokens"),disabled:!0})},oe=function(e){var t,n=e.state,a=Object(_.a)(),o=!n.selectedLPToken||!n.fromToken||!n.toToken,c=Object(r.useMemo)((function(){if(n.fromToken&&n.outputToken===n.fromToken){var e=Object(Q.l)(n.fromAmount,n.fromToken.decimals);return Object(Q.d)(e.add(Object(Q.c)(e,R.b)),n.fromToken.decimals)}if(n.toToken&&n.outputToken===n.toToken){var t=Object(Q.l)(n.toAmount,n.toToken.decimals);return Object(Q.d)(t.add(Object(Q.c)(t,R.b)),n.toToken.decimals)}}),[n.outputToken,n.fromToken,n.toToken,n.fromAmount,n.toAmount]);return l.a.createElement(g.a,null,(n.outputToken===n.fromToken||n.outputToken===n.toToken)&&l.a.createElement(m.a,{amount:c,suffix:null==(t=n.outputToken)?void 0:t.symbol,disabled:o}),l.a.createElement(S.a,{label:n.fromToken?n.fromToken.symbol:a("1st-token"),text:n.fromAmount,disabled:o}),l.a.createElement(S.a,{label:n.toToken?n.toToken.symbol:a("2nd-token"),text:n.toAmount,disabled:o}),l.a.createElement(re,{state:n}))},re=function(e){var t=e.state,n=Object(r.useState)({}),a=o()(n,2),c=a[0],u=a[1];i()((function(){return u({})}),[t.fromSymbol,t.toSymbol,t.fromAmount]);var m=!t.selectedLPTokenAllowed,k=m||Object(Q.j)(t.amount);return l.a.createElement(s.a,{style:{marginTop:W.g.normal}},!t.selectedLPToken||Object(Q.j)(t.amount)?l.a.createElement(le,{state:t,onError:u,disabled:!0}):Object(Q.l)(t.amount,t.selectedLPToken.decimals).gt(t.selectedLPToken.balance)?l.a.createElement(L.a,{symbol:t.selectedLPToken.symbol}):t.loading||!t.pair?l.a.createElement(v.a,null):l.a.createElement(l.a.Fragment,null,l.a.createElement(d.a,{token:t.selectedLPToken,spender:F.e,onSuccess:function(){return t.setSelectedLPTokenAllowed(!0)},onError:u,hidden:!m}),l.a.createElement(le,{state:t,onError:u,disabled:k})),c.message&&4001!==c.code&&l.a.createElement(j.a,{error:c}))},le=function(e){var t=e.state,n=e.onError,a=e.disabled,o=Object(_.a)(),c=Object(r.useCallback)((function(){n({}),t.onRemove().catch(n)}),[t.onRemove,n]);return l.a.createElement(f.a,{title:o("remove-liquidity"),disabled:a,loading:t.removing,onPress:c})};t.default=function(){var e=Object(_.a)();return l.a.createElement(ee.a,null,l.a.createElement(O.a,null,l.a.createElement(k.a,null),l.a.createElement(y.a,null,l.a.createElement(I.a,{text:e("remove-liquidity")}),l.a.createElement(B.a,{light:!0},e("remove-liquidity-desc")),l.a.createElement(te,null)),"web"===c.a.OS&&l.a.createElement(C.a,null)),l.a.createElement(H.b,null))}}}]);
//# sourceMappingURL=16.956b8e9f.chunk.js.map