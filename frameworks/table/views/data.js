sc_require('views/table_row');

// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SC Endash */

/**
  @class

  DataView handles the display of tableRow views.
  It extends CollectionFastPath to provide accelerated rendering.

  @extends SC.View
  @author Christopher Swasey
*/

/*globals Endash */

Endash.DataView = SC.ListView.extend({
  backgroundColor: 'red',
  /**
    TableRow
    @property {SC.View}
  */
  exampleView: SC.TableRowView,
  
  blocks: null,
  
  blocksOrder: null,
  
  init: function() {
    this.set('blocks', [
      Endash.TableRowBlock.create({
        // backgroundColor: 'white',
        backgroundColor: 'blue', 
        contentBinding: '.parentView*content', 
        columnsBinding: '.parentView*columns'
      }),
      Endash.TableRowBlock.create({
        backgroundColor: 'green',
        // backgroundColor: 'white',
        contentBinding: '.parentView*content',
        columnsBinding: '.parentView*columns'
      })
    ]);
    
    this.set('childViews', this.get('blocks'))

    sc_super();
  },

  reloadIfNeeded: function(r) {

    if(!this.get('content')) { 
      this.layoutBlocks(); 
      return;
    }

      
    var clippingFrame = this.get('clippingFrame'),
      _frame = this._frame;
    
    // if(!_frame || _frame.height != clippingFrame.height) 
      
    var blocks = this.get('blocks'),
      blockHeight = this.get('blockHeight'),
      blockPosition = Math.floor(clippingFrame.y / blockHeight),
      oldPosition = this._blockPosition,
      blockDiff = Math.floor((clippingFrame.y - blockPosition) / blockHeight),
      nowShowing = r || this.get('nowShowing'),
      frame;
    
    
    block = blocks.find(function(block) {
      var frame = {
        y: block.get('top'),
        height: block.get('height')
      }
      return frame.y < clippingFrame.y && frame.y + frame.height > clippingFrame.y
    }, this);
    
    if(!block) {
      block = blocks.objectAt(0);
      block2 = blocks.objectAt(1);
      
      block.set('position', -1)
      block2.set('position', 0)

      var frame = {
        y: this.rowOffsetForContentIndex(nowShowing.get('min')),
        height: blockHeight
      }
      
      // console.log(block.get('frame').height)
      this.layoutBlock(block, this.contentIndexesInRect(frame));
      // console.log(block.get('frame').height)
      // range = this.fitRangeToBlock(block, );
      // console.log(range)
      // this.fitBlockToRange(block, range);
      

      if(!_frame || _frame.y >= clippingFrame.y) {
        // put the block below b/c we're scorlling down
        var frame = {
          y: block.get('top') + block.get('height'),
          height: blockHeight
        }
        
        console.log(frame)
        
        this.layoutBlock(block2, this.contentIndexesInRect(frame));
        
      } else {
        // put the block above b/c we're scrolling up
        block2.adjust({
         // top: clippingFrame.y - blockHeight,
         // height: blockHeight
        });
      }

    } else {
      console.log('second branch');
            

      block2 = blocks.objectAt( blocks.indexOf(block) == 0 ? 1 : 0)

      if(block2.get('position') == 0)
        return;
        
      block.set('position', -1)
      block2.set('position', 0)
      console.log('second branch2');
      // console.log('branch 2', block2.get('isVisible'), block2.get('isVisibleInWindow'))
      
      // if(block2.get('isVisible'))
        // return;
        
      if(_frame.y <= clippingFrame.y) {
        // put the block below b/c we're scorlling down
console.log('reposition')
        var frame = {
          y: block.get('top') + block.get('height'),
          height: blockHeight
        }
        
        this.layoutBlock(block2, this.contentIndexesInRect(frame));
        
      } else {
        // put the block above b/c we're scrolling up
        block2.adjust({
         // top: clippingFrame.y - blockHeight,
         // height: blockHeight
        });
      }
    }

    this._frame = SC.clone(clippingFrame)
    this.adjust(this.computeLayout());
  },
  
  layoutBlock: function(block, range) {
    console.log(range.toArray())
    block.set('range', range);
    var layout = {
      top: this.rowOffsetForContentIndex(range.get('min')),
      height: this.rowOffsetForContentIndex(range.get('max')) - this.rowOffsetForContentIndex(range.get('min'))
    }
    console.log(layout.height)
    this.repositionView(block, layout);
    block.set('height', layout.height)
    block.set('top', layout.top)
    return range;
  },
  
  layoutBlocks: function() {
    var clippingFrame = this.get('clippingFrame'),
      blocks = this.get('blocks'),
      blockHeight = Math.floor(clippingFrame.height * 2);

    this.set('blockHeight', blockHeight);
    
    var layout = {
      top: 0,
      height: blockHeight
    };
    
    blocks.forEach(function(block) {
      // block.adjust('height', blockHeight);
      delete block.get('layer').style['top']
      delete block.get('layer').style['height']
      this.repositionView(block, layout);
      block.set('height', blockHeight)
    }, this);
  },
  
  
  repositionView: function(view, layout) {
    if(!view) return
    
    var layer = view.get('layer'),
      transform;
      
    if (layer) {
      if(SC.platform.supportsAcceleratedLayers) {
      // if(SC.platform.touch) {
        transform = 'translate3d(0px,' + layout.top + 'px, 0) ';
        layer.style.webkitTransform = transform;
        layer.style.webkitTransformOrigin = "top left";
      } else {
        layer.style.top = layout.top + "px";
      }
      layer.style.height = layout.height + "px";
    } else {
      view.adjust(layout);
    }
  },
  
  
  
  
  
  /** @private
    Tells ScrollView that this should receive live updates during touch scrolling.
    We are so fast, aren't we?
  */
  _lastTopUpdate: 0,

  /** @private */
  _lastLeftUpdate: 0,

  /** @private */
  _tolerance: 100,
  
  /** @private */
  touchScrollDidChange: function(left, top) {
    // prevent getting too many in close succession.
    if (Date.now() - this._lastTouchScrollTime < 25) return;
    
    var clippingFrame = this.get('clippingFrame');
    
    var cf = this._inScrollClippingFrame || (this._inScrollClippingFrame = {x: 0, y: 0, width: 0, height: 0});
    cf.x = clippingFrame.x; cf.y = clippingFrame.y; cf.width = clippingFrame.width; cf.height = clippingFrame.height;
    
    // update
    cf.x = left;
    cf.y = top;
    
    var r = this.contentIndexesInRect(cf);
    if (!r) return; // no rect, do nothing.
    
    var len = this.get('length'), 
        max = r.get('max'), min = r.get('min');

    if (max > len || min < 0) {
      r = r.copy();
      r.remove(len, max-len).remove(min, 0-min).freeze();
    }
    
    if (this._lastNowShowing) {
      if (r.contains(this._lastNowShowing) && this._lastNowShowing.contains(r)) return;
    }
    this._lastNowShowing = r;
    this.reloadIfNeeded(r, YES);
    
    this._lastTouchScrollTime = Date.now();
  }

});
