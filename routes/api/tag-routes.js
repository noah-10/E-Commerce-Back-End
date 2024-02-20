const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags and its associated Product data
  try{
    const allTags = await Tag.findAll({
      include: {model: Product}
    });
    res.json(allTags);
  }catch(err){
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id` with its associated Product data
  try{
    const tagData = await Tag.findByPk(req.params.id,{
      include: {model: Product}
    });

    if(!tagData){
      res.status(404).json({message: "No tag found with this id!"});
    }

    res.json(tagData);
  }catch(err){
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag

  //Query should look like {
  //   tag_name: "",
  //   productId: [0,1,3]
  // }

  //But doesnt need a productId

  try{
    const newTag = await Tag.create(req.body);
    //If the tag has products assigned to it, this will create a bulk paring through the ProductTag Model
    if(req.body.productId){
      const productTagIdArr = req.body.productId.map((product_id) => {
        return {
          product_id,
          tag_id: newTag.id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      return res.json(productTagIds);
    }
    // if no products are assigned to the new tag then just respond
    res.json(newTag);
  }catch(err){
    res.json(err);
  }

});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    });

    if(!updatedTag){
      res.status(404).json({message: "No tag found with this id!"})
    }

    res.json(updatedTag);
  }catch(err){
    res.json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value

  try{
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
  
    if(!deleteTag){
      res.status(404).json({message: "No tag with this id!"});
    }
  
    res.json(deleteTag);
  }catch(err){
    res.json(err);
  }
  
});

module.exports = router;
